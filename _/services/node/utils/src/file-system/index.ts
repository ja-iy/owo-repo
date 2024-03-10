import fs from 'fs-extra'
import path from 'path'
import { isIgnoredFolder } from '@repo/ts-vars/dev'


export function findNestedFilePath(directory: string, fileName: string): string | false {
    const files = fs.readdirSync(directory)

    for (const file of files) {

        const filePath = path.join(directory, file)
        const stats = fs.statSync(filePath)

        if (stats.isDirectory() && !isIgnoredFolder(file)) {
            const foundFilePath = findNestedFilePath(filePath, fileName)
            if (foundFilePath) { return foundFilePath }
        }
        else if (stats.isFile() && file === fileName) { return filePath }
    }

    return false
}


export async function fileSystemImport(filePath: string) {
    return (await import('file://' + filePath))
}
