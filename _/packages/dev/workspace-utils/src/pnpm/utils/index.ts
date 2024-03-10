import { findWorkspaceDir } from "@pnpm/find-workspace-dir"
import { findWorkspacePackages } from "@pnpm/workspace.find-packages"

import type { Project } from "@pnpm/workspace.find-packages"

import type { Overwrite } from "@repo/ts-utils/types"

export * from "@pnpm/find-workspace-dir"
export * from "@pnpm/workspace.find-packages"
export * from "@pnpm/resolve-workspace-range"
export * from "@pnpm/workspace.read-manifest"
export * from "@pnpm/filter-workspace-packages"



// Named packages

export type ManifestWithName = Overwrite<Project['manifest'], { name: string }>
export type ProjectWithName = Overwrite<Project, { manifest: ManifestWithName }>

export function filterPackagesWithName(packages: Project[]): ProjectWithName[] {
    return packages.filter(pkg => pkg.manifest.name) as ProjectWithName[]
}

export async function findNamedWorkspacePackages(input?:{rootDirectory?: string}): Promise<ProjectWithName[]> {

    const rootDirectory = input?.rootDirectory ?? await findWorkspaceDir(process.cwd())

    if (!rootDirectory) { throw new Error(`Failed to find workspace root directory. ${ process.cwd() }`) }
    const allPackages = await findWorkspacePackages(rootDirectory)

    return filterPackagesWithName(allPackages)
}