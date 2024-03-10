import sharp from 'sharp'
import fs from 'fs-extra'
import path from 'path'


export const optimizer = { 
    '.jpeg': generateOptimizedJpeg,
    '.png': generateOptimizedPng,
    '.webp': generateOptimizedWebp,
}

export async function generateOptimizedPng(sourcePath: string, destinationPath: string): Promise<void> {
    try {
        const image = sharp(sourcePath)
        // const metadata = await image.metadata()

        const pngBuffer = await image
            .png({ quality: 80 })
            .toBuffer()

        const extension = path.extname(destinationPath)
        const pngDestinationPath = destinationPath.replace(extension, '.png')
        await fs.ensureDir(path.dirname(pngDestinationPath))
        await fs.writeFile(pngDestinationPath, pngBuffer)



        // console.log(`Generated Optimized Png for ${sourcePath}`)
    } catch (error) {
        console.error(`Error processing ${sourcePath}: ${error}`)
        throw error
    }
}

async function generateOptimizedJpeg(sourcePath: string, destinationPath: string): Promise<void> {
    try {
        const image = sharp(sourcePath)
        // const metadata = await image.metadata()

        const jpegBuffer = await image
            .jpeg({ quality: 80 })
            .toBuffer()

        const extension = path.extname(destinationPath)
        const jpegDestinationPath = destinationPath.replace(extension, '.jpeg')
        await fs.ensureDir(path.dirname(jpegDestinationPath))
        await fs.writeFile(jpegDestinationPath, jpegBuffer)



        // console.log(`Generated Optimized Jpeg for ${sourcePath}`)
    } catch (error) {
        console.error(`Error processing ${sourcePath}: ${error}`)
        throw error
    }
}

async function generateOptimizedWebp(sourcePath: string, destinationPath: string): Promise<void> {
    try {
        const image = sharp(sourcePath)
        // const metadata = await image.metadata()

        const webpBuffer = await image
            .webp({ quality: 80 })
            .toBuffer()

        const extension = path.extname(destinationPath)
        const webpDestinationPath = destinationPath.replace(extension, '.webp')
        await fs.ensureDir(path.dirname(webpDestinationPath))
        await fs.writeFile(webpDestinationPath, webpBuffer)

        // console.log(`Generated Optimized Webp for ${sourcePath}`)
    } catch (error) {
        console.error(`Error processing ${sourcePath}: ${error}`)
        throw error
    }
}

