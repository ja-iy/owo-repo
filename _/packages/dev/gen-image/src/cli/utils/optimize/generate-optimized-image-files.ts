// import sharp from 'sharp'
import fs from 'fs-extra'
import path from 'path'
import { objectKeys } from '@repo/ts-utils/object'

import type { GenerateImagesConfig } from '../../../config'

import type { ProjectWithName } from '@repo/workspace-utils'


export async function generate_optimized_image_files(input:{
    sourcePackage: ProjectWithName,
    outputPackage: ProjectWithName,
    config: GenerateImagesConfig,
}) {

    const { sourcePackage, outputPackage, config } = input

    const sourceDir = `${ sourcePackage.dir }${ config.source.path }`
    const destinationDir = `${ outputPackage.dir }${ config.optimize.path }`

    const optimizier = config.optimizer

    async function processImagesInDirectory(directory: string, destinationDir: string, baseDir: string): Promise<void> {
        const files = await fs.readdir(directory)

        for (const file of files) {

            // const stats = await fs.stat(sourcePath)

            const sourcePath = path.join(directory, file)
            const relativePath = path.relative(baseDir, sourcePath)
            const destinationPath = path.join(destinationDir, relativePath)
            const extension = path.extname(file)

            const stats = await fs.stat(sourcePath)

            if (stats.isDirectory()) {
                await processImagesInDirectory(sourcePath, destinationDir, baseDir)
            }

            else if (stats.isFile() && config.fileMatcher.has(extension)) {
                for (const ext of objectKeys(optimizier)) {
                    await optimizier[ext]!(sourcePath, destinationPath)
                }
            }
        }
    }

    async function deleteUnusedFiles(sourceDir: string, destinationDir: string) {
        const sourceDirPaths = await getAllImageFiles(sourceDir)

        const usedPaths = new Set<string>()

        for (const ext of objectKeys(optimizier)) {
            sourceDirPaths.forEach(v => {
                const relativePath = path.relative(sourceDir, v)
                usedPaths.add(relativePath.replace(path.extname(relativePath), ext))
            })
        }

        // console.log(`Found ${usedPaths.size} used image files in ${sourceDir} \n\n`, usedPaths)

        await deleteUnusedFilesInSubDir(destinationDir, usedPaths, destinationDir)
        await deleteUnusedSubDirs(destinationDir)

    }

    async function deleteUnusedFilesInSubDir(currentDirectory: string, usedPaths: Set<string>, baseDir: string): Promise<void> {

        const previewPaths = await fs.readdir(currentDirectory)

        for (const previewPath of previewPaths) {
            const fullPath = path.join(currentDirectory, previewPath)
            const checkMatchPath = path.relative(baseDir, fullPath)
            const stats = await fs.stat(fullPath)

            if (stats.isDirectory()) {
                await deleteUnusedFilesInSubDir(fullPath, usedPaths, baseDir)
            }

            else if (stats.isFile() && !usedPaths.has(checkMatchPath)) {
                try {
                    await fs.unlink(fullPath)
                    // console.log(`Deleted unused preview: ${fullPath}`)
                } catch (error) {
                    console.error(`Error deleting ${ fullPath }: ${ error }`)
                }
            }
        }
    }

    async function deleteUnusedSubDirs(currentDirectory: string): Promise<void> {

        const previewPaths = await fs.readdir(currentDirectory)

        for (const previewPath of previewPaths) {
            const fullPath = path.join(currentDirectory, previewPath)
            const stats = await fs.stat(fullPath)

            if (stats.isDirectory()) { await deleteUnusedSubDirs(fullPath) }
        }

        const remaingPaths = await fs.readdir(currentDirectory)
        if (remaingPaths.length === 0) {
            try {
                await fs.rmdir(currentDirectory)
                // console.log(`Deleted unused preview: ${fullPath}`)
            } catch (error) {
                console.error(`Error deleting directory ${ currentDirectory }: ${ error }`)
            }
        }
    }

    async function getAllImageFiles(directory: string): Promise<string[]> {
        const result: string[] = []
        const files = await fs.readdir(directory)

        for (const file of files) {
            const filePath = path.join(directory, file)
            const stats = await fs.stat(filePath)

            if (stats.isDirectory()) {
                const subFiles = await getAllImageFiles(filePath)
                result.push(...subFiles)
            } else if (stats.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(file)) {
                result.push(filePath)
            }
        }

        return result
    }


    try {
        // console.log(`... STARTED GENERATING OPTIMIZED IMAGE FILES \n`)

        await fs.ensureDir(destinationDir)
        await processImagesInDirectory(sourceDir, destinationDir, sourceDir)
        await deleteUnusedFiles(sourceDir, destinationDir)

        console.log(`\n ✅ FINISHED GENERATING OPTIMIZED IMAGE FILES`)
    } catch (error) {
        console.error('\n ❌ ERROR GENERATING OPTIMIZED IMAGE FILES:', error)
    }
}
