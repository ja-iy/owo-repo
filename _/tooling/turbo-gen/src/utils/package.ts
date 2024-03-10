import { execSync } from "node:child_process"
import type { PlopTypes } from "@turbo/gen"
import { z } from "zod"

import { CONSOLE_COLORS as cc } from "@repo/ts-utils/message"
import { isValidFolderName } from "@repo/ts-utils/string"
import { objectKeys, deepMerge } from "@repo/ts-utils/object"
import { cz } from "@repo/ts-utils/validation"
import type { LiteralOrString, PackageJson, RelativePath, UnionToTuple, Overwrite } from "@repo/ts-utils/types"
import { REPO_CONFIG_FOLDER_NAME, REPO_GEN_FOLDER_NAME, REPO_TS_INCLUDE_SPECIAL_FOLDERS, REPO_TS_AUTO_EXCLUDED_PATTERNS, REPO_TS_EXCLUDE_FOLDERS } from "@repo/ts-vars/dev"
import fs from 'fs-extra'

export const WORKSPACE_ROOTS = new Set(['_', '_apps'])

export type BaseAnswers = z.infer<typeof baseAnswerSchema>
export type UnresolvedBaseAnswers = Omit<BaseAnswers, 'preset'>
export type Extends_UnresolvedBaseAnswers = Overwrite<Record<string, unknown>, typeof baseAnswerShape>

export const presetNames = ['base', 'react', 'next', 'dev-tool'] as const
export const presetDisplayNames = ['Typescript Package', 'React Package', 'Next Package', 'Dev Tool'] as const

export const enabledPresetNames = [ presetNames[0], presetNames[1], presetNames[3] ] as const
export const enabledPresetsDisplayNames = [ presetDisplayNames[0], presetDisplayNames[1], presetDisplayNames[3] ] as const

export const isValidWorkspace = (parts: string[]) => {
    const worspaceRoot = parts[1]
    if (!worspaceRoot) { return false }
    if (!WORKSPACE_ROOTS.has(worspaceRoot)) { return false }
    return true
}

export type Action = PlopTypes.ActionType

export type PresetName = typeof presetNames[number]

export type EslintConfigName = 'library'
export type TsconfigPath = 
    | 'lib/base.json'
    | 'lib/react.json'
    | 'lib/built/base.json'
    | 'lib/built/react.json'
    | 'lib/dev-tool.json'
    | 'lib/built/dev-tool.json'

export type DepsContainers = 'dependencies' | 'devDependencies' | 'peerDependencies' | 'optionalDependencies'

export type DepPrefixValue = '' | '^' | '~' | '>' | '<'
export type UnresolvedDepValue = string | [prefix: DepPrefixValue, name: string] | readonly [prefix: DepPrefixValue, name: string]
export type UnresolvedDeps = Partial<Record<DepsContainers, UnresolvedDepValue[] | readonly UnresolvedDepValue[]>>
export type Deps = Partial<Record<DepsContainers, Record<string, string>>>

export type Preset = {
    extendAnswers?: Record<string, unknown>,
    packageName: string,
    eslint: EslintConfigName[] | readonly EslintConfigName[],
    exports: Record<string, Record<string, string>>,
    scripts: Record<string, string>,
    deps: Deps,
    unresolvedDeps?: UnresolvedDeps
}

export type PresetCreator<TAnswers extends UnresolvedBaseAnswers> = (answers: TAnswers, opts?: unknown) => Preset


export async function resolveUnresolvedDep(prefix: DepPrefixValue, name: string): Promise<string> {

    const res = await fetch(`https://registry.npmjs.org/-/package/${ name }/dist-tags`)
    const info = await res.json() as { latest: string }

    const version = info.latest

    return `${ prefix }${ version }`
}


export const tsup = {

    buildScript: "pnpm with-env tsup",
    devScript: "pnpm with-env tsup -d --watch",

    answers: (input:{built?: boolean, type: (typeof enabledPresetNames)[number]}) => {

        const noExternal: string[] = []
        
        if (input.built && input.type === 'dev-tool') noExternal.push('@repo/ts-vars')

        return {
            noExternal: JSON.stringify(noExternal),
            entry: JSON.stringify({
                "src/index": "./src/index.ts",
            })
        }
    },

}

export const defaults = <TBaseAnswers extends UnresolvedBaseAnswers>(answers: TBaseAnswers ) => {

    const {
        path,
        built,
    } = answers

    const exports = {
        ".": {
            "types": built ? "./dist/src/index.d.ts" : "./src/index.ts",
            "import": built ? "./dist/src/index.js" : "./src/index.ts",
            "require": built ? "./dist/src/index.cjs" : "./src/index.ts",
        }
    }

    const builtScripts = {} as Record<string, string>
    if (built) {

        const isTooling = path.includes('/_/tooling/')
        const isPackages = path.includes('/_/packages/')
        const isLib = path.includes('/lib/')

        builtScripts['build'] = tsup.buildScript
        builtScripts['build:types'] = "pnpm with-env tsc -p . --emitDeclarationOnly --declaration --noEmit false"
        builtScripts['build:deps'] = tsup.buildScript
        if (isLib) builtScripts['build:libs'] = tsup.buildScript
        if (isPackages) builtScripts['build:packages'] = tsup.buildScript
        if (isTooling) builtScripts['build:tooling'] = tsup.buildScript

        builtScripts['dev'] = tsup.devScript
        builtScripts['dev:deps'] = tsup.devScript
        if (isLib) builtScripts['dev:libs'] = tsup.devScript
        if (isPackages) builtScripts['dev:packages'] = tsup.devScript
        if (isTooling) builtScripts['dev:tooling'] = tsup.devScript

    }


    return {

        extendAnswers: {
            tsGlobalsImportLine: `import "@repo/ts-globals"`,
        },

        exports: exports,

        eslint: ['library'] as const,

        scripts: {
            ...builtScripts,
            "clean": "rm -rf .turbo node_modules dist",
            "lint": "eslint .",
            "typecheck": "tsc --noEmit",
            "prettie:format": "prettier --check \"**/*.{mjs,ts,md,json}\"",
            "with-env": "dotenv -e .env -- ",
        },

        deps: {

            dependencies: {
                "@repo/ts-vars": "workspace:*",
                "@repo/ts-utils": "workspace:*",
            },

            devDependencies: {
                "@repo/ts-globals": "workspace:*",
                "@repo/eslint-config": "workspace:*",
                "@repo/prettier-config": "workspace:*",
                "@repo/tsconfig": "workspace:*",
                ...built ? { "@repo/tsup-config": "workspace:*" } : {} as unknown as { "@repo/tsup-config": "workspace:*" }
            }
        },

        unresolvedDeps: {

            dependencies: [
                'zod'
            ],

            devDependencies: [
                "eslint",
                "prettier",
                "typescript",
                "dotenv-cli",
                "tsx",
                "type-fest",
                "@types/node",
                ...(built ? ['tsup'] : []),
            ],
        }
    }
}

export const tsconfig = {

    answers: (input:{built?: boolean, type: (typeof enabledPresetNames)[number]}) => {

        const include = ["."]

        for (const pattern of REPO_TS_AUTO_EXCLUDED_PATTERNS) {
            for (const folder of REPO_TS_INCLUDE_SPECIAL_FOLDERS) {
                if (pattern.test(folder)) include.push(`${ folder }/**/*`)
            }
        }

        const exclude = REPO_TS_EXCLUDE_FOLDERS.map(v=>v)

        return {
            include: JSON.stringify(include),
            exclude: JSON.stringify(exclude),
            extendsPath: `lib/${ input.built ? 'built/' : '' }${ input.type }.json` as const satisfies TsconfigPath
        }
    },
}




export const tailwindBase = {

    __du: 'tw-base',

    answers: {
        imports: [`import { TW_PRESET__base } from "@repo/tailwind-config/base"`],
        presets: ['TW_PRESET__base']
    },

    deps: {

        devDependencies: {
            "@repo/tailwind-config": "workspace:*",
        }
    },

    unresolvedDeps: {

        devDependencies: [
            "tailwindcss",
            "postcss",
            "autoprefixer",
            "postcss-import",
        ]
    }

} as const


export const react = {

    deps: {
        dependencies: {
            "@repo/css-utils": "workspace:*",
            "@repo/react-utils": "workspace:*",
        },

        devDependencies: {

        }
    },

    unresolvedDeps: {

        dependencies: [
            "react",
            "react-dom",
        ],

        devDependencies: [
            "@types/react",
            "@types/react-dom",
        ]

    }

} as const

export const next = {


    deps: {

    },

    unresolvedDeps: {

        dependencies: [
            "next",
        ],

    }

} as const

export const devTool = {

    deps: {
        dependencies: {
            "@repo/workspace-utils": "workspace:*",
            "@repo/node-utils": "workspace:*",
        },

        devDependencies: {

        }
    },

    unresolvedDeps: {

        dependencies: [
            "boxen",
            "yargs",
            "fs-extra",
            "@inquirer/core",
            "@inquirer/prompts",
        ],

        devDependencies: [
            "@types/fs-extra",
            "@types/yargs",
        ]

    }

} as const




export const depsResolver = async (resolved: Deps, unresolved: Partial<UnresolvedDeps>) => {


    // for each unresolved dep, get the resolved version and add it to the resolved deps
    const depsMap = new Map<string, string>()

    for (const rawKey in unresolved) {

        const key = rawKey as DepsContainers

        resolved[key] = resolved[key] ?? {}

        for (const dep of unresolved[key]!) {

            const [prefix, name] = typeof dep === 'string' ? ['^', dep] as const : dep

            let version = depsMap.get(name)
            if (!version) {
                const resolvedVersion = await resolveUnresolvedDep(prefix, name)
                depsMap.set(name, resolvedVersion)
                version = resolvedVersion
            }
            resolved[key]![name] = version
        }
    }


    // add all remote deps to peer deps if not already present
    if (resolved.dependencies) {

        resolved.peerDependencies = resolved.peerDependencies ?? {}
        const deps = resolved.dependencies
        const peer = resolved.peerDependencies

        for (const name in deps) {
            const version = peer[name] || deps[name]!
            if (version.startsWith('workspace:')) continue
            peer[name] = version
        }
    }


    return resolved
}



export const resolvePreset = async (preset: Preset) => {

    const resolvedDeps = preset.unresolvedDeps
        ? await depsResolver(preset.deps, preset.unresolvedDeps)
        : preset.deps

    return {

        packageJson: {

            name: preset.packageName,
            private: true,
            version: "0.0.0",
            type: "module",

            scripts: preset.scripts,

            exports: preset.exports,

            dependencies: resolvedDeps.dependencies,
            peerDependencies: resolvedDeps.peerDependencies,
            devDependencies: resolvedDeps.devDependencies,
            optionalDependencies: resolvedDeps.optionalDependencies,

            eslintConfig: {
                root: true,
                extends: preset.eslint.map(name => `@repo/eslint-config/${ name }`)
            },

            prettier: "@repo/prettier-config"
        },

        extendAnswers: preset.extendAnswers

    }
}

export const schmeas = {

    path: z.string()
        .transform(v => v.startsWith('/') ? v : '/' + v)
        .transform(v => v.endsWith('/') ? v.slice(0, -1) : v)
        .superRefine((v, ctx) => {
            if (!v.startsWith("/")) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${ cc.red }Path must start with a slash` })
            if (v.endsWith("/")) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${ cc.red }Path must not end with a slash` })

            const parts = v.split("/")

            if (parts.length < 3) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${ cc.red }Cannot add a package to the root folder` }); return }

            if (!isValidWorkspace(parts)) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${ cc.red }Invalid workspace ${ cc.reset }${ parts[1] } in path ${ v }` }); return }

            for (let i = 1; i < parts.length; i++) {
                const part = parts[i]!
                if (!part) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${ cc.red }Path must not contain empty folders` }); return }
                if (!isValidFolderName(part)) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${ cc.red }Invalid folder path ${ cc.reset }: ${ v } , name: ${ part }` }); return }
            }
        })
    ,

    pathChecks: z.object({
        parentCreated: z.boolean(),
        parentExists: z.boolean(),
        pathTaken: z.boolean(),
    }),

    packageName: z.string(),

    deps: z.object({
        dependencies: z.record(z.string()).optional(),
        devDependencies: z.record(z.string()).optional(),
        peerDependencies: z.record(z.string()).optional(),
        optionalDependencies: z.record(z.string()).optional(),
    }).optional(),

    unresolvedDeps: z.object({
        dependencies: z.array(z.string()).optional(),
        devDependencies: z.array(z.string()).optional(),
        peerDependencies: z.array(z.string()).optional(),
        optionalDependencies: z.array(z.string()).optional(),
    }).optional(),

    built: z.boolean().optional(),
}


export const baseAnswerShape = {
    path: schmeas.path,
    // packageName: schmeas.packageName,
    // presetName: cz.enum(presetNames),

    // deps: schmeas.deps,
    // unresolvedDeps: schmeas.unresolvedDeps,

    built: schmeas.built,
}

export const baseAnswerSchema = z.object(baseAnswerShape)


