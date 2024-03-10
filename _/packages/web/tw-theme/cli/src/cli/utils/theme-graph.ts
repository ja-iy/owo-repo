import { TW_THEME_PACKAGE_NAME_PREFIX } from '@repo/tw-theme/vars'

//types
import type { ThemeProject } from '@/cli/utils/find'


export function determinePackagesToBuild(input: {
    selected: ThemeProject,
    packages: ThemeProject[],
}) {

    const packagesToBuild = [input.selected]
    const selectedName = input.selected.manifest.name

    if (selectedName.startsWith(TW_THEME_PACKAGE_NAME_PREFIX)) {
        for (const pkg of input.packages) {
            
            const packageName = pkg.manifest.name
            if (packageName === selectedName) continue
            if (!pkg.manifest.dependencies?.[selectedName]) continue 
            
            if (packageName.startsWith(TW_THEME_PACKAGE_NAME_PREFIX)) {
                throw new Error(`Theme packages must not be dependant on each other: ${ packageName } depends on ${ selectedName }.`)
            }

            packagesToBuild.push(pkg) 
        }
    }

    return packagesToBuild
}