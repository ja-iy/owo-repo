#!/usr/bin/env node

import yargs from 'yargs'
import { findNamedWorkspacePackages } from '@repo/workspace-utils'
import type { ProjectWithName } from '@repo/workspace-utils'
import Fuse from 'fuse.js'
import { cc, progress, spinners } from '@repo/node-utils/console'
import { select } from '@inquirer/prompts'
import boxen from 'boxen'
import { generateImages } from './utils/generate-images'
import { importConfigs } from './utils/import-configs'

/* EXECUTE PROGRAM */ main()

async function main() {

    const usageMessage = '\n'+boxen(cc.bold(cc.white("cd into package")), {
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

            // defintion
            .command('* [package]', '', yargs => {
                return yargs
                    .positional('package', {
                        type: 'string',
                        describe: 'name in package.json',
                        demandOption: false,
                    })
            },

            // handler
            async argv => {
                if (!argv.package) program.showHelp()
                return await genImagesForPackage({ packageName: argv.package })
            })

    return await program.parseAsync(process.argv.slice(2))
}




export async function genImagesForPackage(input: {
    packageName?: string,
    packages?: ProjectWithName[]
    rootDirectory?: string
}) {

    let packageName: string = undefined!

    try {

        const packages = input.packages ?? await findNamedWorkspacePackages({ rootDirectory: input.rootDirectory })
        packageName = input.packageName ?? await selectPacakge({ message: 'Select an assest package:', packages })

        // find the package
        const pkg = packages.find(pkg => pkg.manifest.name === packageName.trim())

        // if not found, suggest packages
        if (!pkg) {

            console.error(cc.red(`Failed to find package ${ packageName } in workspace.`) + cc.reset(''))
            const fuse = new Fuse(packages, { keys: ['manifest.name'] })

            const results = fuse.search(packageName)
            if (!results.length) { return }

            return await genImagesForPackage({
                packageName: await selectPacakge({
                    message: `Similar Packages :`,
                    packages: results.map(result => result.item),
                    pageSize: 10,
                }),
                packages
            })
        }

        const config = await importConfigs(pkg)

        return await generateImages({
            sourcePackage: pkg,
            configs: config.configs,
            packages,
        })
    }
    catch (error) {
        console.error(cc.red(`\nFailed to gen images ${ packageName ?? '' }: ${ cc.white(String(error)) }\n`))
    }
}


async function selectPacakge(input: {
    message: string,
    packages: ProjectWithName[],
    pageSize?: number
}) {
    console.log(`\n`)
    return await select({
        message: input.message,
        choices: input.packages.map(pkg => ({
            title: pkg.manifest.name,
            value: pkg.manifest.name
        })),
        pageSize: input.pageSize ?? 4,
    })
}



