import yargs from 'yargs'
import Fuse from 'fuse.js'
import boxen from 'boxen'
import { select } from '@inquirer/prompts'

import { cc, progress, spinners } from '@repo/node-utils/console'
import { findWorkspaceDir, findNamedWorkspacePackages, findWorkspacePackages } from '@repo/workspace-utils'

import { TW_THEME_PACKAGE_NAME_PREFIX } from '@repo/tw-theme/vars'

import { findThemeWorkspacePackages } from '@/cli/utils/find'
import { buildThemes } from '@/cli/utils/build'

//types
import type { ThemeProject } from '@/cli/utils/find'


export async function selectThemePackage(input: {
    packageName?: string,
    packages?: ThemeProject[],
    rootDirectory?: string
}) {

    const packages = input.packages ?? await findThemeWorkspacePackages({ rootDirectory: input.rootDirectory })

    if (!packages.length) { throw new Error(`Failed to find any theme packages.`) }

    if (input.packageName) {

        const existingPackage = packages.find(pkg => pkg.manifest.name === input.packageName)
        if (existingPackage) { return existingPackage }

        else {
            console.error(cc.red(`Failed to find package ${ input.packageName } in workspace.`) + cc.reset(''))
            const fuse = new Fuse(packages, { keys: ['manifest.name'] })
            const results = fuse.search(input.packageName)
            const pkg = results.length
                ? await selectPacakge({
                    message: `Select Similar theme :`,
                    packages: results.map(result => result.item),
                    pageSize: 10,
                })
                : await selectPacakge({
                    message: `Select A Theme :`,
                    packages: packages,
                    pageSize: 10,
                })

            return pkg
        }
    }

    return await selectPacakge({
        message: `Select A Theme :`,
        packages: packages,
        pageSize: 10,
    })
}

export async function selectPacakge(input: {
    message: string,
    packages: ThemeProject[],
    pageSize?: number
}): Promise<ThemeProject> {

    console.log(`\n`)

    const packageName = await select({
        message: input.message,
        choices: input.packages.map(pkg => ({
            title: pkg.manifest.name,
            value: pkg.manifest.name
        })),
        pageSize: input.pageSize ?? 6,
    })

    return input.packages.find(pkg => pkg.manifest.name === packageName)!
}

