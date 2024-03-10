import fs from 'fs-extra'
import { execa, execaSync } from 'execa'
import { cc, createSpinner } from '@repo/node-utils/console'

import { isThemeConfig, createGenTheme } from '@repo/tw-theme/config'
import { TW_THEME_GEN_FOLDER_NAME, TW_THEME_TSCONFIG_FILE_NAME, TW_THEME_TSCONFIG_FILE_PATH } from '@repo/tw-theme/vars'

import { FileActions } from '@repo/node-utils/file-actions'
import { fileSystemImport } from '@repo/node-utils/file-system'

//types
import type { ConsoleColorOptions } from '@repo/node-utils/console'
import type { ThemeProject } from '@/cli/utils/find'
import type { Spinner } from '@repo/node-utils/console'
import type { AppThemeConfig, PackageThemeConfig } from '@repo/tw-theme/config'
import { exec, execSync } from 'child_process'
import { findNamedWorkspacePackages, type ProjectWithName } from '@repo/workspace-utils'
import { REPO_CONFIG_FOLDER_NAME, REPO_GEN_FOLDER_NAME } from '@repo/ts-vars/web'

// BUILD THEME PACKAGES

export async function buildThemes(input: {
    packages: ThemeProject[],
    namedPackages?: ThemeProject[],
    rootDirectory: string
}) {

    const namedPackages = input.namedPackages ?? await findNamedWorkspacePackages({ rootDirectory: input.rootDirectory })

    const results = []
    for (const pkg of input.packages) {
        const spinner = createSpinner()
        console.log('\n')
        try {
            results.push(await buildTheme({ package: pkg, namedPackages, rootDirectory: input.rootDirectory, spinner }))
        }
        catch (error) {
            spinner.text = cc.red(`Failed to build theme ${ pkg.manifest.name }`)
            spinner.fail()
            results.push(false)
            throw error
        }
    }

    input.packages.length > 1
        ? console.log('\n\n', cc.bold(cc.green(`Finished Building all themes`)), '\n')
        : console.log('\n')

    return results
}

const sleep = (ms: number = 10) => new Promise(resolve => setTimeout(resolve, ms))

export async function buildTheme(input: {
    package: ThemeProject,
    namedPackages: ProjectWithName[],
    rootDirectory: string,
    spinner: Spinner,
}) {

    const logAction = (action: string, status: ConsoleColorOptions = 'blue') => `${ cc.bold(cc[status](input.package.manifest.name)) } - theme : ${ action }`

    const spinner = input.spinner.start(logAction(`Initializing build process`, 'magenta'))
    spinner.color = 'magenta'

    const outputPath = (path: string) => `${ input.package.dir }/${ TW_THEME_GEN_FOLDER_NAME }/${ path }`
    const templatePath = (path: string) => `${ input.rootDirectory }/_/packages/web/tw-theme/cli/src/cli/templates/${ path }`

    // validate & import theme config
    await typecheckThemeConfigFile(input)

    const themeConfig = ((await fileSystemImport(input.package.themeFilePath)).default)
    if (!isThemeConfig(themeConfig)) { throw new Error(`Invalid theme config in ${ input.package.themeFilePath } at ${ input.package.themeFilePath }`) }

    if (themeConfig.__DU === 'tw-theme-package') return await buildThemePackage({ config: themeConfig, package: input.package, rootDirectory: input.rootDirectory, spinner: input.spinner, logAction, outputPath, templatePath })
    if (themeConfig.__DU === 'tw-theme-app') return await buildThemeApp({ config: themeConfig, package: input.package, namedPackages: input.namedPackages, rootDirectory: input.rootDirectory, spinner: input.spinner, logAction, outputPath, templatePath })


    throw new Error(`Invalid theme config in ${ input.package.themeFilePath } at ${ input.package.themeFilePath }`)
}

export async function buildThemePackage(input: {
    config: PackageThemeConfig,
    package: ThemeProject,
    rootDirectory: string,
    spinner: Spinner,
    logAction: (action: string, status?: ConsoleColorOptions) => string
    outputPath: (path: string) => string
    templatePath: (path: string) => string
}) {

    const {
        outputPath,
        templatePath,
        logAction,
        spinner
    } = input

    const themeConfig = input.config

    // generate data for file actions
    spinner.color = 'cyan'; spinner.text = logAction(`Parsing theme config`, 'cyan')

    const id = extarctIdFromPackageName(input.package.manifest.name)

    const colors = Object.values(themeConfig.colors)
    const fonts = Object.values(themeConfig.fonts ?? {})

    const GEN_THEME = createGenTheme(themeConfig)

    const data = {
        theme: {
            id: id,
            isThemeResolved: input.package.isThemeResolved,
            genTheme: GEN_THEME,
            genThemeJson: JSON.stringify(GEN_THEME),
        },
        twConfig: {
            colorLines: colors.map(color => color.subType === 'hex'
                ? `"${ color.twName }": '${ color.cssName }'`
                : `"${ color.twName }": '${ color.subType }(var(${ color.cssName }) / <alpha-value>)',`
            ),
            fontLines: fonts.map(font => `"${ font.twName }": ['var(${ font.cssName })'],`),
        },
    }



    // setup file actions 
    const actions = new FileActions({
        createFile: true,
        createParent: true,
        overwriteIfExists: true,
        skipIfExists: false,
    })

    // configs
    actions.push({
        type: 'add',
        path: outputPath('GEN_THEME.ts'),
        templatePath: templatePath('GEN_THEME.ts.hbs'),
    })

    actions.push({
        type: 'add',
        path: outputPath('tailwind.config.ts'),
        templatePath: templatePath('tailwind.config.mjs.hbs'),
    })


    actions.push({
        type: 'add',
        path: outputPath('index.ts'),
        templatePath: templatePath('index.ts.hbs'),
    })

    // utils
    actions.push({
        type: 'add',
        path: outputPath('@client/utils/index.ts'),
        templatePath: templatePath('@client/utils/index.ts.hbs'),
    })

    actions.push({
        type: 'add',
        path: outputPath('@client/hooks/index.ts'),
        templatePath: templatePath('@client/hooks/index.ts.hbs'),
    })





    // execute file actions
    spinner.color = 'cyan'; spinner.text = logAction(`Generating Files (@gen)`, 'cyan')
    const results = await actions.execute(data)


    // format files
    const prettierConfigPath = `${ input.rootDirectory }/_/tooling/prettier/no-tailwind.mjs`
    spinner.color = 'yellow'; spinner.text = logAction(`Formating Files`, 'yellow')
    const formatting = await execa(`pnpm prettier --write ${ outputPath('**') } --list-different --config ${ prettierConfigPath }`)
    if (formatting instanceof Error) throw formatting

    // finish
    spinner.text = cc.green(`Built theme inside ${ cc.bold(input.package.manifest.name) }`)
    spinner.succeed()

    return results
}

export async function buildThemeApp(input: {
    config: AppThemeConfig,
    package: ThemeProject,
    namedPackages: ProjectWithName[],
    rootDirectory: string,
    spinner: Spinner,
    logAction: (action: string, status?: ConsoleColorOptions) => string,
    outputPath: (path: string) => string,
    templatePath: (path: string) => string
}) {

    const {
        outputPath,
        templatePath,
        logAction,
        namedPackages
    } = input

    const spinner = input.spinner.start(logAction(`Initializing build process`, 'magenta'))
    spinner.color = 'magenta'

    const themeConfig = input.config


    // generate data for file actions
    spinner.color = 'cyan'; spinner.text = logAction(`Parsing theme config`, 'cyan')

    const id = extarctIdFromPackageName(input.package.manifest.name)

    const colors = Object.values(themeConfig.colors)
    const fonts = Object.values(themeConfig.fonts ?? {})

    const GEN_THEME = createGenTheme(themeConfig)

    const data = {
        theme: {
            id: id,
            isThemeResolved: input.package.isThemeResolved,
            genTheme: GEN_THEME,
            genThemeJson: JSON.stringify(GEN_THEME),
            settings: themeConfig.settings,
            settingsJson: JSON.stringify(themeConfig.settings),
            darkModeLocalStorageKey: `'${themeConfig.settings.DARKMODE_LOCALSTORAGE_KEY}'`,
            darkModeClassName: `'${themeConfig.settings.DARKMODE_CSS_CLASSNAME}'`,
            overrideInitialUserPrefrence: themeConfig.settings.OVERRIDE_SYSTEM_PREFRENCE_ON_UNSET 
                ? `'${themeConfig.settings.OVERRIDE_SYSTEM_PREFRENCE_ON_UNSET}'` 
                : 'undefined',
        },
        twConfig: {
            colorLines: colors.map(color => color.subType === 'hex'
                ? `"${ color.twName }": '${ color.cssName }'`
                : `"${ color.twName }": '${ color.subType }(var(${ color.cssName }) / <alpha-value>)',`
            ),
            fontLines: fonts.map(font => `"${ font.twName }": ['var(${ font.cssName })'],`),
            presetLines: themeConfig.themePackageNames?.map(packageName => `TW_PRESET_${ packageNameToVariableName(packageName) },`) ?? [],
            presetImportLines: themeConfig.themePackageNames?.map(packageName => `import TW_PRESET_${ packageNameToVariableName(packageName) } from "${ packageName }/tailwind-config"`) ?? [],

            // presetImportLines: await Promise.all(themeConfig.themePackageNames?.map(async packageName => `import TW_PRESET_${ packageNameToVariableName(packageName) } from "${ await tailwindThemePackageImportPath(namedPackages, packageName) }"`) ?? []),
        },
        themeCss: {
            cssVarLinesLight: colors.map(color => `${ color.cssName }: var(${ color.cssNameLight });`),
            cssVarLinesDark: colors.map(color => `${ color.cssName }: var(${ color.cssNameDark });`),
            cssValueLinesLight: colors.map(color => `${ color.cssNameLight }: ${ color.valueLight };`),
            cssValueLinesDark: colors.map(color => `${ color.cssNameDark }: ${ color.valueDark };`),
            importLines: themeConfig.themePackageNames?.map(packageName => `@import "${ packageName }/@config/theme.css";`) ?? [],
        },
        names: {
            // twToCss: {
            //     light: colors.map(color => `["${ color.twName }", "var(${ color.cssNameLight })"],`),
            //     dark: colors.map(color => `["${ color.twName }", "var(${ color.cssNameDark })"],`),
            // },
            list: {
                light: colors.map(color => `"${ color.twName }",`),
                dark: colors.map(color => `"${ color.twName }",`),
            }
        }
    }



    // setup file actions 
    const actions = new FileActions({
        createFile: true,
        createParent: true,
        overwriteIfExists: true,
        skipIfExists: false,
    })

    // configs
    actions.push({
        type: 'add',
        path: outputPath('GEN_THEME.ts'),
        templatePath: templatePath('GEN_THEME.ts.hbs'),
    })

    actions.push({
        type: 'add',
        path: outputPath('GEN_THEME_SETTINGS.ts'),
        templatePath: templatePath('GEN_THEME_SETTINGS.ts.hbs'),
    })

    actions.push({
        type: 'add',
        path: outputPath('GEN_THEME_VAR_NAMES.ts'),
        templatePath: templatePath('GEN_THEME_VAR_NAMES.ts.hbs'),
    })

    actions.push({
        type: 'add',
        path: outputPath('theme.css'),
        templatePath: templatePath('theme.css.hbs'),
    })

    // actions.push({
    //     type: 'add',
    //     path: outputPath('tailwind.config.ts'),
    //     templatePath: templatePath('tailwind.config.mjs.hbs'),
    // })

    actions.push({
        type: 'add',
        path: outputPath('tailwind.config.ts'),
        templatePath: templatePath('tailwind.preset.config.mjs.hbs'),
    })


    actions.push({
        type: 'add',
        path: outputPath('index.ts'),
        templatePath: templatePath('index.ts.hbs'),
    })

    // utils
    actions.push({
        type: 'add',
        path: outputPath('@client/utils/index.ts'),
        templatePath: templatePath('@client/utils/index.ts.hbs'),
    })

    actions.push({
        type: 'add',
        path: outputPath('@client/hooks/index.ts'),
        templatePath: templatePath('@client/hooks/index.ts.hbs'),
    })

    actions.push({
        type: 'add',
        path: outputPath('@client/components/index.ts'),
        templatePath: templatePath('@client/components/index.ts.hbs'),
    })

    actions.push({
        type: 'add',
        path: outputPath('@client/init/index.tsx'),
        templatePath: templatePath('@client/init/index.tsx.hbs'),
    })

    actions.push({
        type: 'add',
        path: outputPath('@client/init/index.tsx'),
        templatePath: templatePath('@client/init/index.tsx.hbs'),
    })

    actions.push({
        type: 'add',
        path: outputPath('BlockingDarkModeInit.@S.tsx'),
        templatePath: templatePath('BlockingDarkModeInit.@S.tsx.hbs'),
    })


    // execute file actions
    spinner.color = 'cyan'; spinner.text = logAction(`Generating Files (@gen)`, 'cyan')
    const results = await actions.execute(data)


    // format files
    const prettierConfigPath = `${ input.rootDirectory }/_/tooling/prettier/no-tailwind.mjs`
    spinner.color = 'yellow'; spinner.text = logAction(`Formating Files`, 'yellow')
    const formatting = await execa(`pnpm prettier --write ${ outputPath('**') } --list-different --config ${ prettierConfigPath }`)
    if (formatting.exitCode || formatting.failed) throw formatting

    // finish
    spinner.text = cc.green(`Built theme inside ${ cc.bold(input.package.manifest.name) }`)
    spinner.succeed()

    return results
}



const coerceToVariableName = (name: string) => name.replace(/[^a-zA-Z0-9_]/g, '_')


const extarctIdFromPackageName = (packageName: `@${ string }/${ string }` | string) => {

    if (!packageName.startsWith('@')) return coerceToVariableName(packageName)

    const parts = packageName.split('/')

    if (parts.length < 2) throw new Error(`Invalid package name ${ packageName }`)
    if (parts[0]!.startsWith('@repo')) return coerceToVariableName(parts[1]!)
    return coerceToVariableName(`${ parts[0]!.replace('@', '') }__${ parts[1]! }`)
}


//NEEDS-IMPROVEMENT: currently cannot spcify --project and specify a file specific file https://github.com/microsoft/TypeScript/issues/27379
// workaround: create a specific tsconfig (tsconfig.theme.json) for each theme package / app theme which only includes the theme file
const typecheckThemeConfigFile = async (input: { package: ThemeProject }) => {
    if (input.package.manifest?.scripts?.['typecheck']) {

        const tsconfigPath = `${ input.package.dir }/${ TW_THEME_TSCONFIG_FILE_NAME }`

        try {

            fs.writeFileSync(tsconfigPath, TW_THEME_TS_CONIFG_DATA, { flag: "w" })
            const command = `pnpm --filter ${ input.package.manifest.name } typecheck --project ${ input.package.dir }\\${ TW_THEME_TSCONFIG_FILE_NAME }`

            await new Promise<boolean>((resolve, reject) => {
                exec(command.replace(/[\s\n]+/g, ' '), (error, stdout, stderr) => {
                    if (error) { reject(error) }
                    resolve(true)
                })
            })

            fs.removeSync(tsconfigPath)
        }
        catch (error) {
            // console.log('DEBUG TYPECHECK:', error)
            fs.removeSync(tsconfigPath)
            throw new Error(`Type Error in  ${ input.package.themeFilePath }`)
        }
    }
}

const TW_THEME_TS_CONIFG_DATA = JSON.stringify({
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "rootDir": ".",
        "baseUrl": ".",
        "outDir": "dist",
        "composite": false,
        "incremental": false
    },
    "include": ["theme.config.mjs", "@config/theme.config.mjs"],
    "exclude": ["node_modules", "dist", "build", "out", "output"]
})


const packageNameToVariableName = (packageName: string) => packageName.replace(/[^a-zA-Z0-9_]/g, '_')

const tailwindThemePackageImportPath = async (packages: ProjectWithName[], packageName: string) => {
    const pkg = packages.find(pkg => pkg.manifest.name === packageName)
    if (!pkg) throw new Error(`Could not find theme package ${ packageName }`)
    const isCustom = await fs.pathExists(`${ pkg.dir }/${ REPO_CONFIG_FOLDER_NAME }/tailwind.config.ts`)

    return isCustom
        ? `${ packageName }/@config/tailwind-config`
        : `${ packageName }/${ REPO_GEN_FOLDER_NAME }/tailwind-config`
}