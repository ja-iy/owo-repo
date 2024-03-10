import { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import nodePlop from "node-plop"
import type { NodePlopAPI, PlopGenerator } from "node-plop"
import type { Reformat } from "@repo/ts-utils/types"

const __dirname = dirname(fileURLToPath(import.meta.url))



type RunPlopGeneratorInput = {
    generatorName: string,
    generatorPath: GeneratorPath,
    bypassArgs?: string[]
}
export async function runPlopGenerator(input: RunPlopGeneratorInput) {


    const plop = await getPlop({
        generatorPath: input.generatorPath
    })

    const gen = plop.getGenerator(input.generatorName)

    const answers = (await gen.runPrompts(input.bypassArgs)) as unknown[]
    const results = await gen.runActions(answers, {
        onComment: (comment: string) => { console.log(comment) },
    })

    return results as Results
}

type GeneratorPath = `${ string }.${ 'js' | 'cjs' | 'mjs' }`


type PlopActionHooksFailures = {
    type: string;
    path: string;
    error: string;
    message: string;
}

type PlopActionHooksChanges = {
    type: string;
    path: string;
}

type Results = {
    changes: PlopActionHooksChanges[],
    failures: PlopActionHooksFailures[],
}


type GetPlopInput = {
    generatorPath: GeneratorPath
}
export async function getPlop(input: GetPlopInput): Promise<NodePlopAPI> {

    const plop = await nodePlop(input.generatorPath)

    return plop
}


