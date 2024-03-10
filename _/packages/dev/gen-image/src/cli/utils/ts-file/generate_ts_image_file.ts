import sharp from 'sharp'
import fs from 'fs-extra'
import path from 'path'
import { FileActions } from '@repo/node-utils/file-actions'

import type { GenerateImagesConfig } from '../../../config'
import type { ProjectWithName } from '@repo/workspace-utils'
import { REPO_ASSETS_FOLDER_NAME } from '@repo/ts-vars/dev'
import { GEN_IMAGE__GENERATED_SOURCE_IMAGES_SUBPATH } from '@/vars'


type Config = GenerateImagesConfig

type OptimizedExts = keyof Config['optimizer']

export async function generate_image_file(input: {
    sourcePackage: ProjectWithName,
    outputPackage: ProjectWithName,
    config: GenerateImagesConfig,
}) {

    const { sourcePackage, outputPackage, config } = input

    const sourceDir = `${ sourcePackage.dir }${ config.source.path }`
    const previewsFilePath = `${ outputPackage.dir }${ config.imagesFile.path }`

    const outputGenSourcePathPrefix = config.source.genPath.slice(7)

    async function generateLqipDataUrl(sourcePath: string): Promise<string> {
        try {
            const image = sharp(sourcePath)
            const metadata = await image.metadata()

            const lqipBuffer = await image
                .resize({ width: 20, height: 20, fit: 'inside' }) // Adjust dimensions as needed
                .toBuffer()

            const dataUrl = `data:image/${ metadata.format };base64, ${ lqipBuffer.toString('base64') }`

            return dataUrl
        } catch (error) {
            console.error(`Error processing ${ sourcePath }: ${ error }`)
            throw error
            // return ''
        }
    }


    async function processImagesInDirectory(directory: string, destinationDir: string, baseDir: string, data: string[]): Promise<string[]> {

        const files = await fs.readdir(directory)

        for (const file of files) {
            const sourcePath = path.join(directory, file)
            const extension = path.extname(file)

            const stats = await fs.stat(sourcePath)

            if (stats.isDirectory()) {
                await processImagesInDirectory(sourcePath, destinationDir, baseDir, data)
            }


            else if (stats.isFile() && config.fileMatcher.has(extension)) {

                const sourcePath = path.join(directory, file)
                const relativePath = path.relative(baseDir, sourcePath)

                // const destinationPath = path.join(destinationDir, path.relative(baseDir, sourcePath))
                // const relativePath = path.relative(process.cwd(), sourcePath)

                const readableRelativePath = convertPublicFileToRelativePath(relativePath)
                const optimizedRelativePaths = config.optimizeExtensions.map((ext) => replaceFileExtension(readableRelativePath, ext))

                const dataUrl = await generateLqipDataUrl(sourcePath)
                if (!dataUrl) { throw new Error(`No data URL generated for ${ sourcePath }`) }



                const res = {
                    path: outputGenSourcePathPrefix + '/' + relativePath.replace(/\\/g, '/'),
                    optPaths: optimizedRelativePaths.map(optimizedRelativePath => `${ config.optimize.path.slice(7) }${ optimizedRelativePath }`),
                    // lqipPath: `${ config.preview.path.slice(7) }${ readableRelativePath }`,
                    lqipDataUrl: dataUrl,
                }

                // console.log('PREVIEW PATHS: ', res)

                data.push(` export const ${ formatVariableName(relativePath) } =  {\n
                    name: '${ path.basename(sourcePath) }' as const,
                    ${config.source.needsSourceFiles
                        ?`src: {
                            path: '${ res.path }',
                            extension: '${ path.extname(sourcePath) }' as const,
                        },`
                        :`src: undefined,`
                    }
                    opt: {
                        ${ config.optimizeExtensions.map((ext, i) => `'${ ext.slice(1) }': { path: '${ res.optPaths[i] }' as const },`).join('\n') }
                    },
                    lqip: '${ res.lqipDataUrl }',
                }\n\n`)


                // console.log(`Generated data URL for ${sourcePath}`)
            }

        }

        return data

    }

    async function createFile(destinationDir: string, baseDir: string, data: string[], config:GenerateImagesConfig): Promise<void> {

        const fileData = `
            export type PublicImage =  {\n
                name: string,
                ${config.source.needsSourceFiles
                    ?`src: {
                        path: string,
                        extension: '.jpg' | '.jpeg' | '.png' | '.gif',
                    },`
                    :`src?: undefined,`
                }
                opt: {
                    ${ config.optimizeExtensions.map((ext, i) => `'${ ext.slice(1) }': { path: string },`).join('\n') }
                },
                lqip: string,
            }\n\n\n

            ${ data.join('\n') }
        `

        const actions = new FileActions({
            createFile: true,
            createParent: true,
            overwriteIfExists: true,
        })


        actions.push({
            type: 'add',
            path: previewsFilePath,
            content: fileData,
        })

        await actions.execute({})

    }

    function formatVariableName(filePath: string): string {
        const varName = filePath.split('\\')
        // for (let i = 0; i < config.source.shiftLength; i++) { varName.shift() }
        const ending = varName.pop()!
        return `images_${ varName.join('_') }___${ ending }`.replace(/[^\w]/g, '_').replace(/^_+/, '').replace(/_+$/, '')
    }

    function convertPublicFileToRelativePath(input: string): string {
        let filePath = input
        filePath = filePath.startsWith('public') ? filePath.slice(7) : filePath
        filePath = filePath.replace(/\\/g, '/')
        filePath = filePath.startsWith('/') ? filePath : '/' + filePath
        return filePath
    }

    function replaceFileExtension(filePath: string, newExtension: string): string {
        const extension = path.extname(filePath)
        return filePath.replace(extension, newExtension)
    }

    try {
        // console.log(`... STARTED GENERATING IMAGE FILE \n`)

        await fs.ensureDir(path.dirname(previewsFilePath))
        const data = await processImagesInDirectory(sourceDir, previewsFilePath, sourceDir, [])
        await createFile(previewsFilePath, sourceDir, data, config)

        // await formatFileByLocationWithPrettier(previewsFilePath)

        console.log(`\n ✅ FINISHED GENERATING IMAGE FILE`)
    } catch (error) {
        console.error('\n ❌ ERROR GENERATING IMAGE FILE:', error)
    }
}
