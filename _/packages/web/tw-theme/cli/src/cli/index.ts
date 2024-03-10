#!/usr/bin/env node

import yargs from 'yargs'
import boxen from 'boxen'

import { cc } from '@repo/node-utils/console'
import { findWorkspaceDir } from '@repo/workspace-utils'

import { findThemeWorkspacePackages } from '@/cli/utils/find'
import { selectThemePackage } from '@/cli/utils/prompt'
import { determinePackagesToBuild } from '@/cli/utils/theme-graph'
import { buildThemes } from '@/cli/utils/build'

// import {} from '../../../../../../ui/base/theme'

import type { ThemeProject } from '@/cli/utils/find'


/* EXECUTE PROGRAM */ cli().catch(e => { throw e })

/* REQUIREMENTS FOR CORRECT OPERATION

    all themes :

        - must have a package.json
        - package.json must have a unique name
        - must be in a pnpm workspace
        - must have @repo/tw-theme as a dependency
        - must have either:
            a file with TW_THEME_CONFIG_FILE_NAME (theme.config.mjs) at the pnpm workspace root
            a file with TW_THEME_CONFIG_FILE_NAME (theme.config.mjs) in a folder named REPO_CONFIG_FOLDER_NAME (.config)
        - all theme packages must start with TW_THEME_PACKAGE_NAME_PREFIX (@repo-theme/)
        - no package starting with TW_THEME_PACKAGE_NAME_PREFIX (@repo-theme/) can be a dependency of another package starting with TW_THEME_PACKAGE_NAME_PREFIX (@repo-theme/)
*/


async function cli() {

    const usageMessage = '\n' + boxen(cc.bold(cc.white("cd into package")), {
        borderStyle: 'round',
        borderColor: 'cyan',
        width: 24,
        textAlignment: 'center',
    }) + '\n'

    const program = yargs()

        .usage(usageMessage)
        .version().alias("v", "version")
        .help().alias("h", "help")

        // no command
        .command('* [package]', '',

            // defintion
            yargs => {
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
                await main({ packageName: argv.package })
                return
            }
        )

    return await program.parseAsync(process.argv.slice(2))
}


export async function main(input: {
    packageName?: string,
}) {

    let pkg: ThemeProject | undefined = undefined

    try {

        const rootDirectory = await findWorkspaceDir(process.cwd())
        if (!rootDirectory) { throw new Error(`Failed to find workspace root directory. ${ process.cwd() }`) }
        const namedPackages = await findThemeWorkspacePackages({ rootDirectory })
        const themePackages = await findThemeWorkspacePackages({ rootDirectory, packages: namedPackages })

        // const namedPackages = await findNamedWorkspacePackages({ rootDirectory })
        // console.log('NAMED PACKAGES', namedPackages.map(pkg => pkg.manifest.name))
        // console.log('THEME PACKAGES', themePackages.map(pkg => pkg.manifest.name))

        pkg = await selectThemePackage({
            rootDirectory,
            packageName: input.packageName,
            packages: themePackages,
        })

        const packagesToBuild = determinePackagesToBuild({ selected: pkg, packages: themePackages })

        return await buildThemes({ rootDirectory, packages: packagesToBuild, namedPackages })
    }
    catch (error) {
        console.error(cc.red(`\ntw-theme cli failed on ${ pkg?.manifest.name ?? '' }: ${ cc.white(String(error)) }\n`))
    }
}











