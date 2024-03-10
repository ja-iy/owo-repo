#!/usr/bin/env node


import fs from 'fs-extra'
import path from 'path'

import { findWorkspaceDir, findNamedWorkspacePackages, findWorkspacePackages } from '@repo/workspace-utils'

import { isThemeConfig } from '@repo/tw-theme/config'
import { isIgnoredFolder, REPO_CONFIG_FOLDER_NAME } from '@repo/ts-vars/dev'
import { TW_THEME_PACKAGE_NAME_PREFIX, TW_THEME_CONFIG_FILE_NAME } from '@repo/tw-theme/vars'

//types
import type { ProjectWithName } from '@repo/workspace-utils'
import type { LiteralOrString } from '@repo/ts-utils/types'


export type ThemeFilePath = LiteralOrString<`/${typeof TW_THEME_CONFIG_FILE_NAME}`>

export type ThemeProject = ProjectWithName & {
    themeFilePath: ThemeFilePath
    isThemeResolved: boolean
}

export const knownThemeConfigPaths = [
    `/${TW_THEME_CONFIG_FILE_NAME}`,
    `/${ REPO_CONFIG_FOLDER_NAME }/${TW_THEME_CONFIG_FILE_NAME}`
] as const


export async function findThemeWorkspacePackages(input: {
    rootDirectory?: string,
    packages?: ProjectWithName[]
}): Promise<ThemeProject[]> {

    const rootDirectory = input.rootDirectory ?? await findWorkspaceDir(process.cwd())

    if (!rootDirectory) { throw new Error(`Failed to find workspace root directory. ${ process.cwd() }`) }

    const namedPackages = await findNamedWorkspacePackages({ rootDirectory })

    const themePackages: ThemeProject[] = []

    for (const pkg of namedPackages) {
        const themeFilePath = getThemeFilePath(pkg)
        if (themeFilePath) { themePackages.push({ ...pkg, themeFilePath, isThemeResolved:isThemeResolved(pkg) }) }
    }

    return themePackages
}



export function getThemeFilePath(pkg: ProjectWithName): string | false {
    if (!pkg.manifest.dependencies?.['@repo/tw-theme']) { return false }

    // search for known paths
    for (const knownPath of knownThemeConfigPaths) {
        const themeFilePath = path.join(pkg.dir, knownPath)
        if (fs.existsSync(themeFilePath)) { return themeFilePath }
    }

    // allow for any path (performance cost not major but potentially significat for massive monorepos with many packages that depend on themes )
    // const themeFilePath = findNestedFilePath(pkg.dir, REPO_THEME_CONFIG_FILE_NAME)
    // if (themeFilePath) { return themeFilePath }

    return false
}

export function isThemeResolved(pkg: ProjectWithName): boolean {
    return !pkg.manifest.name.startsWith(TW_THEME_PACKAGE_NAME_PREFIX)
}

export function createThemePackage(pkg: ProjectWithName): ThemeProject | false {
    const themeFilePath = getThemeFilePath(pkg)
    return themeFilePath ? { ...pkg, themeFilePath, isThemeResolved:isThemeResolved(pkg) } : false
}

