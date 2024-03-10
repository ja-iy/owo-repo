#!/usr/bin/env node

import yargs from 'yargs'
import { findNamedWorkspacePackages, findWorkspaceDir } from '@repo/workspace-utils'
import type { ProjectWithName } from '@repo/workspace-utils'
import { cc, progress, spinners } from '@repo/node-utils/console'
import boxen from 'boxen'
import { FileActions } from '@repo/node-utils/file-actions'
import { AUTO_IMPORT_GEN__GEN_FOLDER_PATH, AUTO_IMPORT_GEN__IGNORE_EXPORT_KEY_ENDINGS, AUTO_IMPORT_GEN__IMPORT_FILE_PATH, AUTO_IMPORT_GEN__IGNORE_PACKAGE_EXPORTS, AUTO_IMPORT_GEN__DO_NOT_CREATE } from '@/vars'
import fs from "fs-extra"

/* EXECUTE PROGRAM */ main()

async function main() {

    const usageMessage = '\n' + boxen(cc.bold(cc.white("cd into package")), {
        borderStyle: 'round',
        borderColor: 'cyan',
        width: 24,
        textAlignment: 'center',
    }) + '\n'

    // PROGRAM
    const program = yargs()

        .usage(usageMessage)
        // .version().alias("v", "version")
        .help().alias("h", "help")

        // DEFAULT 
        .command('* [package]', '', yargs => {
            return yargs
                .positional('package', {
                    type: 'string',
                    describe: 'name in package.json',
                    demandOption: false,
                })
                .option('c', {
                    alias: 'clean',
                    type: 'boolean',
                    describe: 'remove all generated files and side effects',
                    demandOption: false,
                })
        }, async argv => {
            if (argv.c) return await cleanExports()
            // if (!argv.package) program.showHelp()
            return await generateExports({ packageName: argv.package })
        })

    return await program.parseAsync(process.argv.slice(2))
}



export async function generateExports(input: {
    packageName?: string,
}) {

    // if (input.packageName) return await generateRelatedExports(input.packageName)
    return await generateAllExports()
}

async function generateAllExports() {

    const rootDirectory = await findWorkspaceDir(process.cwd())

    const packages = await findNamedWorkspacePackages({ rootDirectory })

    // setup file actions 
    const actions = new FileActions({
        createFile: true,
        createParent: true,
        overwriteIfExists: true,
    })

    for (const pkg of packages) {

        // skip directories with no tsconfig
        if (!fs.existsSync(outputPath(pkg, 'tsconfig.json'))) {
            AUTO_IMPORT_GEN__IGNORE_PACKAGE_EXPORTS.add(pkg.manifest.name)
            AUTO_IMPORT_GEN__DO_NOT_CREATE.add(pkg.manifest.name)
        }

        // skip adding exports for directories with empty or invalid exports
        const exports = pkg.manifest.exports
        if (!exports || typeof exports !== 'object' || Object.keys(exports).length === 0 || Array.isArray(exports)) AUTO_IMPORT_GEN__IGNORE_PACKAGE_EXPORTS.add(pkg.manifest.name)
    }

    const packageImportLines = new Map<string, string[]>()

    // create import lines
    for (const pkg of packages) {

        if (AUTO_IMPORT_GEN__IGNORE_PACKAGE_EXPORTS.has(pkg.manifest.name)) continue

        const exports = pkg.manifest.exports!
        const packageName = pkg.manifest.name
        const importVairableName = packageNameToValidVariableName(packageName)
        const lines = [`// ${ packageName }`]
        let i = 0

        for (const key in exports) {

            if (!isValidExportKey(key) || !exports[key]) continue
            lines.push(`import type * as ${ importVairableName }__${ i } from "${ packageName }${ key.startsWith('.') ? key.slice(1) : key }"`)
            i = i + 1
        }
        packageImportLines.set(pkg.manifest.name, lines)
    }

    // create imports
    for (const pkg of packages) {

        if (AUTO_IMPORT_GEN__DO_NOT_CREATE.has(pkg.manifest.name)) continue

        // detect packages which need import lines
        const packagesWhichNeedImports = new Set<string>()

        for (const key in pkg.manifest.dependencies) {
            const value = pkg.manifest.dependencies[key]
            if (!needsImport(value)) continue
            packagesWhichNeedImports.add(key)
        }

        for (const key in pkg.manifest.devDependencies) {
            const value = pkg.manifest.devDependencies[key]
            if (!needsImport(value)) continue
            packagesWhichNeedImports.add(key)
        }

        if (packagesWhichNeedImports.size === 0) continue

        // create import file
        const lines = ['/* eslint-disable @typescript-eslint/no-unused-vars */\n// eslint-disable-next-line @typescript-eslint/ban-ts-comment\n// @ts-nocheck']

        for (const key of packagesWhichNeedImports) {
            const importLines = packageImportLines.get(key)
            if (!importLines) continue
            lines.push('\n',...importLines)
        }

        actions.push({
            type: 'add',
            path: outputPath(pkg, AUTO_IMPORT_GEN__IMPORT_FILE_PATH),
            content: lines.join('\n')
        })
    }

    await actions.execute({})

    console.log(cc.bold(cc.green('\u2714 Generated auto imports.')))
}



async function cleanExports() {

    const rootDirectory = await findWorkspaceDir(process.cwd())
    const packages = await findNamedWorkspacePackages({ rootDirectory })

    for (const pkg of packages) {

        const featureGenFolderPath = outputPath(pkg, AUTO_IMPORT_GEN__GEN_FOLDER_PATH)
        if (fs.existsSync(featureGenFolderPath)) { fs.removeSync(featureGenFolderPath) }
    }

    console.log(cc.bold(cc.green('\u2714 Removed all generated files and side effects')))
}

//utils

const outputPath = (pkg: ProjectWithName, path: string) => `${ pkg.dir }/${ path }`
const isValidExportKey = (key: string) => !AUTO_IMPORT_GEN__IGNORE_EXPORT_KEY_ENDINGS.has(key.slice(key.lastIndexOf('.')))
const packageNameToValidVariableName = (packageName: string) => packageName.replace(/[^a-zA-Z0-9]/g, '_')

type PackageVersionPrefix = 'workspace:'
type PackageVersion = `${ PackageVersionPrefix }${ string }`

function needsImport(packageVersion: string | undefined): packageVersion is PackageVersion {
    if (!packageVersion) return false
    return packageVersion.startsWith('workspace:')
}

