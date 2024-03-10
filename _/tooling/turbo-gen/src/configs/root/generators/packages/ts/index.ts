import { execSync } from "node:child_process"
import { z } from "zod"
import fs from 'fs-extra'

import { CONSOLE_COLORS as cc } from "@repo/ts-utils/message"
import { deepMerge } from "@repo/ts-utils/object"
import { cz } from "@repo/ts-utils/validation"

import {
    schmeas, baseAnswerShape,
    defaults, next, react, tailwindBase, tsconfig, tsup, devTool,
    enabledPresetNames, enabledPresetsDisplayNames, resolvePreset,
} from "../../../../../utils/package"

//types
import type { PlopTypes } from "@turbo/gen"
import type { RelativePath } from "@repo/ts-utils/types"
import type { Action, PresetName, PresetCreator, Extends_UnresolvedBaseAnswers } from "../../../../../utils/package"


const answerShape = {
    ...baseAnswerShape,

    path: schmeas.path,
    packageName: schmeas.packageName,
    presetName: cz.enum(enabledPresetNames),

    deps: schmeas.deps,
    unresolvedDeps: schmeas.unresolvedDeps,

    built: schmeas.built,

} satisfies Extends_UnresolvedBaseAnswers

const answerSchema = z.object(answerShape).transform(async (v) => {

    const preset = await resolvePreset(presets[v.presetName](v))

    return {
        ...v,
        ...preset.extendAnswers,
        preset: preset,
    }
})

type Answers = z.infer<typeof answerSchema>
type UnresolvedAnswers = Omit<Answers, 'preset'>


// creates typescript packages based on presets and user input
export function PLOP_GEN_PACKAGE__ts(plop: PlopTypes.NodePlopAPI): void {

    plop.setGenerator("ts", {

        description: "Generate a typescript package",

        prompts: async (inquirer) => {


            // get preset name
            const presetName = await inquirer.prompt({
                type: "list",
                name: "presetName",
                message: "Which preset would you like to use ?",
                choices: enabledPresetsDisplayNames,
                filter: input => enabledPresetNames[enabledPresetsDisplayNames.indexOf(input)]
            })


            // get path 
            let path: { path: string } = undefined as unknown as { path: string }
            let pathSuccess: boolean = false
            let pathTaken: boolean = false
            let parentExists: boolean = false
            let parentCreated: boolean = false

            while (!pathSuccess) {

                path = undefined as unknown as { path: string }
                pathTaken = false
                parentExists = false
                parentCreated = false

                path = await inquirer.prompt({
                    type: "input",
                    name: "path",
                    message: "Where do you want to create the package ?",
                    default: "_/packages/web/new-package",
                })

                const parsed = answerShape.path.safeParse(path.path)
                if (!parsed.success) { console.log(parsed.error.errors[0]?.message); continue }
                path.path = parsed.data

                pathTaken = fs.existsSync(process.cwd() + path.path)
                if (pathTaken) { console.log(`${ cc.red }Path already exists ${ cc.reset }: ${ path.path }`); continue }

                const parentPath = path.path.split('/').slice(0, -1).join('/')
                parentExists = fs.existsSync(process.cwd() + parentPath)

                if (!parentExists) {
                    const createParentConfirm = await inquirer.prompt({
                        type: "confirm",
                        name: "value",
                        message: `Path ${ cc.yellow }${ parentPath }${ cc.reset }${ cc.bold } does not exist, do you want to create it ?`,
                    })
                    parentCreated = createParentConfirm.value
                    if (!parentCreated) { console.log(`Select another path.`); continue }
                }

                pathSuccess = true
            }

            // get package name
            const packageName = await inquirer.prompt({
                type: "input",
                name: "packageName",
                message: "What is the name of the package ?",
                default: 'e.g. @repo/new-package'
            })

            // get built
            const built = await inquirer.prompt({
                type: "confirm",
                name: "built",
                message: "Do you want this package to build ?",
                default: true,
            })

            // resolve answers ( has to be done here as actions cannot be async )
            return await answerSchema.parseAsync({
                path: path.path,
                built: built.built,
                pathChecks: {
                    parentCreated: parentCreated,
                    parentExists: parentExists,
                    pathTaken: pathTaken,
                },
                packageName: packageName.packageName,
                presetName: presetName.presetName,

            })

        },

        actions: (rawAnswers) => {

            const answers = rawAnswers as Answers

            const {
                path,
                built,
                packageName,
                deps,
                preset
            } = answers;



            const cwd = process.cwd()//.replace('turbo/generators', '')

            const itemPath = (relativePath: RelativePath) => `${ cwd }${ path }${ relativePath }`
            const templatePath = (templatePath: RelativePath) => `${ cwd }/_/tooling/turbo-gen/src/configs/root/generators/packages/ts/templates${ templatePath }`

            const actions: Action[] = []

            // create package.json
            actions.push({
                type: "add",
                path: itemPath("/package.json"),
                template: JSON.stringify(preset.packageJson, null, 4),
            })

            // create tsconfig.json
            if ('tsconfig' in answers) {
                answers.built
                    ? actions.push({
                        type: "add",
                        path: itemPath("/tsconfig.json"),
                        templateFile: templatePath("/tsconfig-built.json.hbs"),
                    })
                    : actions.push({
                        type: "add",
                        path: itemPath("/tsconfig.json"),
                        templateFile: templatePath("/tsconfig.json.hbs"),
                    })
            }

            // create gloabl.d.ts
            actions.push({
                type: "add",
                path: itemPath("/global.d.ts"),
                templateFile: templatePath("/global.d.ts.hbs"),
            })

            // create tailwind.config.ts
            if ('tailwind' in answers) {
                actions.push({
                    type: "add",
                    path: itemPath("/tailwind.config.ts"),
                    templateFile: templatePath("/tailwind-config.hbs"),
                })
            }

            // create src/index.ts
            actions.push({
                type: "add",
                path: itemPath("/src/index.ts"),
                template: `export const name = '{{ packageName }}'`,
            })

            // create tsup.config.ts
            if (built) {
                actions.push({
                    type: "add",
                    path: itemPath("/tsup.config.mjs"),
                    templateFile: templatePath("/tsup-config.hbs"),
                })
            }

            // install deps and format files
            actions.push(async () => {

                console.log(`Installing deps...`)
                execSync(`pnpm --filter ${ answers.packageName } i`, { stdio: "inherit" })

                console.log(`Formatting files...`)
                execSync(`pnpm prettier --write ${ itemPath('/**') } --list-different`)

                return "Package scaffolded"

            })

            return actions
        }
    })
}



const presets = {

    "base": (answers) => {
        const d = defaults(answers)
        return {
            extendAnswers: {
                ...d.extendAnswers,
                tsconfig: tsconfig.answers({ built: answers.built, type: 'base' }),
                tsupConfig: answers.built ? tsup.answers({ built: answers.built, type: 'base' }) : undefined
            },
            packageName: answers.packageName,
            eslint: d.eslint,
            exports: d.exports,
            scripts: d.scripts,
            deps: d.deps,
            unresolvedDeps: d.unresolvedDeps
        }
    },

    "react": (answers) => {
        const d = defaults(answers);
        return {
            extendAnswers: {
                ...d.extendAnswers,
                tailwind: tailwindBase.answers,
                tsconfig: tsconfig.answers({ built: answers.built, type: 'react' }),
                tsupConfig: answers.built ? tsup.answers({ built: answers.built, type: 'react' }) : undefined
            },
            packageName: answers.packageName,
            eslint: d.eslint,
            exports: d.exports,
            scripts: d.scripts,
            deps: deepMerge(d.deps, react.deps, tailwindBase.deps, answers?.deps ?? {}),
            unresolvedDeps: deepMerge(d.unresolvedDeps, react.unresolvedDeps, tailwindBase.unresolvedDeps, answers?.unresolvedDeps ?? {})
        }
    },

    "dev-tool": (answers) => {
        const d = defaults(answers)
        return {
            extendAnswers: {
                ...d.extendAnswers,
                tsconfig: tsconfig.answers({ built: answers.built, type: 'dev-tool' }),
                tsupConfig: answers.built ? tsup.answers({ built: answers.built, type: 'dev-tool' }) : undefined
            },
            packageName: answers.packageName,
            eslint: d.eslint,
            exports: d.exports,
            scripts: d.scripts,
            deps: deepMerge(d.deps, devTool.deps, answers?.deps ?? {}),
            unresolvedDeps: deepMerge(d.unresolvedDeps, devTool.unresolvedDeps, answers?.unresolvedDeps ?? {})
        }
    },

    // disabled
    "next": (answers) => {
        const d = defaults(answers)
        return {
            extendAnswers: {
                ...d.extendAnswers,
                tailwind: tailwindBase.answers,
                tsconfig: tsconfig.answers({ built: answers.built, type: 'react' }),
                tsupConfig: answers.built ? tsup.answers({ built: answers.built, type: 'react' }) : undefined
            },
            packageName: answers.packageName,
            eslint: d.eslint,
            exports: d.exports,
            scripts: d.scripts,
            deps: deepMerge(d.deps, react.deps, next.deps, tailwindBase.deps),
            unresolvedDeps: deepMerge(d.unresolvedDeps, react.unresolvedDeps, next.unresolvedDeps, tailwindBase.unresolvedDeps)
        }
    },

} as const satisfies Record<PresetName, PresetCreator<UnresolvedAnswers>>




