#!/usr/bin/env node

import yargs from 'yargs'
import { findNamedWorkspacePackages } from '@repo/workspace-utils'
import type { ProjectWithName } from '@repo/workspace-utils'
import Fuse from 'fuse.js'
import { cc, progress, spinners } from '@repo/node-utils/console'
import { clipboard } from '@repo/node-utils/clipboard'
import { select } from '@inquirer/prompts'
import boxen from 'boxen'
import { openNewTerminal } from '@/utils'

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
                return await cdToPackage({ packageName: argv.package })
            })

    return await program.parseAsync(process.argv.slice(2))
}




export async function cdToPackage(input: {
    packageName?: string,
    packages?: ProjectWithName[]
    rootDirectory?: string
}) {

    let packageName: string = undefined!

    try {

        const packages = input.packages ?? await findNamedWorkspacePackages({ rootDirectory: input.rootDirectory })
        packageName = input.packageName ?? await selectPacakge({ message: 'Select a package to cd into:', packages })

        // find the package
        const pkg = packages.find(pkg => pkg.manifest.name === packageName.trim())

        // if not found, suggest packages
        if (!pkg) {

            console.error(cc.red(`Failed to find package ${ packageName } in workspace.`) + cc.reset(''))
            const fuse = new Fuse(packages, { keys: ['manifest.name'] })

            const results = fuse.search(packageName)
            if (!results.length) { return }

            return await cdToPackage({
                packageName: await selectPacakge({
                    message: `Similar Packages :`,
                    packages: results.map(result => result.item),
                    pageSize: 10,
                }),
                packages
            })
        }

        //convert path for platform
        let result = pkg.dir
        if (process.platform === 'win32') result = process.env.SHELL?.endsWith('bash.exe') ? convertToPosixPath(result) : result
        else result = convertToPosixPath(pkg.dir)


        //copy the path to clipboard and notify user
        console.log(
            cc.gray(`\nFound ${ pkg.manifest.name }`),
            cc.gray(`\n\nPATH: ${ cc.green(result) }`),
            cc.gray(`\nPASTED: ${ cc.bold(`${ cc.green(`( Ctrl + V )`) } ${ (cc.white(`to cd into package directory`)) }\n`) }`)
        )
        clipboard.writeSync(`cd ${ result }`)

        return
    }
    catch (error) {
        console.error(cc.red(`\nFailed to navigate to package ${ packageName ?? '' }: ${ cc.white(String(error)) }\n`))
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

function convertToPosixPath(path: string): string {
    return path.replace(/\\/g, '/')
}

