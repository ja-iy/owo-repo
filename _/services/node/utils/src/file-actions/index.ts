import Handlebars from "handlebars"
import fs, { createFile } from "fs-extra"
import path from "path"

const fileActions = {
    add: ACTION_add,
    // modify: ACTION_modify,
} satisfies Record<ActionTypes, ActionFunction<unknown>>


type ActionTypes =
    "add"
// | "modify"

type Action<TData> =
    | ActionConfig_add<TData>
// | ActionConfig_modify

const defaultConfig = {
    overwriteIfExists: false,
    skipIfExists: false,
    createFile: true,
    createParent: false,
    onSuccess: "continue",
    onFailure: "throw",
    noLog: false
} satisfies Required<CommonActionConfig<unknown>>

const defaultConfigs = {
    add: {
        ...defaultConfig,
    },
    // modify: {
    //     ...defaultConfig,
    //     createFile: false,
    // },
} satisfies Required<Record<ActionTypes, ActionsConfig<unknown>>>

type ActionFunction<TData> = (data: TData, config: Action<TData>, actionsConfig?: ActionsConfig<TData>) => Promise<ActionReturn<TData>>

type ActionTemplateInput =
    | { template: string, templatePath?: undefined, content?: undefined }
    | { templatePath: string, template?: undefined, content?: undefined }
    | { content: string, template?: undefined, templatePath?: undefined }

type CommonActionConfig<TData> = {
    createParent?: boolean
    createFile?: boolean
    overwriteIfExists?: boolean
    skipIfExists?: boolean,
    onSuccess?: OnSuccess<TData>,
    onFailure?: OnFailure<TData>,
    noLog?: boolean,
}

type OnSuccessOpts = "continue" | "abort"
type OnSuccessCallback<TData> = (data: TData, config: Action<TData>, actionsConfig?: ActionsConfig<TData>) => Promise<[OnSuccessOpts, typeof data]>
type OnSuccess<TData> = OnSuccessOpts | OnSuccessCallback<TData>

type OnFailureOpts = "continue" | "abort" | "throw"
type OnFailureCallback<TData> = (data: TData, config: Action<TData>, actionsConfig?: ActionsConfig<TData>) => Promise<[OnFailureOpts, typeof data]>
type OnFailure<TData> = OnFailureOpts | OnFailureCallback<TData>

type ActionsConfig<TData> = {
    onSuccess?: OnSuccess<TData>,
    onFailure?: OnFailure<TData>,
} & CommonActionConfig<TData>

type ActionConfig<TData> = {
    type: string,
    path: string,
} & CommonActionConfig<TData>

type ActionConfig_add<TData> = {
    type: "add"
}
    & ActionConfig<TData>
    & ActionTemplateInput

type ActionConfig_modify<TData> = {
    type: "modify"
}
    & ActionConfig<TData>


const resolveActionInput = <TData, TAction extends Action<TData>>(
    config: TAction,
    actionsConfig?: ActionsConfig<TData>
) => {
    return {
        ...defaultConfigs[config.type],
        ...actionsConfig,
        ...config,
        // overwriteIfExists: config.overwriteIfExists ?? actionsConfig?.overwriteIfExists ?? defaultConfigs.add.overwriteIfExists,
        // skipIfExists: config.skipIfExists ?? actionsConfig?.skipIfExists ?? defaultConfigs.add.skipIfExists,
        // createFile: config.createFile ?? actionsConfig?.createFile ?? defaultConfigs.add.createFile,
        // createParent: config.createParent ?? actionsConfig?.createParent ?? defaultConfigs.add.createParent,
        // onSuccess: config.onSuccess ?? actionsConfig?.onSuccess ?? defaultConfigs.add.onSuccess,
        // onFailure: config.onFailure ?? actionsConfig?.onFailure ?? defaultConfigs.add.onFailure,
        // noLog: config.noLog ?? actionsConfig?.noLog ?? defaultConfigs.add.noLog,
    }
}

type ActionResult = {
    success: boolean,
    skipped: boolean,
    createdParent: boolean,
    createdFile: boolean,
    overwritten: boolean,
    error?: unknown,
    aborted?: boolean,
}

type ActionReturn<TData> =
    | ReturnType<typeof actionSuccess<TData>>
    | ReturnType<typeof actionError<TData>>

const actionResult = (): ActionResult => ({
    success: false,
    skipped: false,
    createdParent: false,
    createdFile: false,
    overwritten: false,
})

function getTemplateString({
    template,
    templatePath,
}: ActionTemplateInput) {

    if (template) { return template }
    if (templatePath) { return fs.readFileSync(templatePath).toString() }
    throw new Error(`No template or templatePath provided`)
}

function renderTemplate<TData>(
    data: TData,
    unresolvedTemplate: ActionTemplateInput
) {
    const templateString = getTemplateString(unresolvedTemplate)
    return Handlebars.compile(templateString)(data)
}


async function actionSuccess<TData>(
    data: TData,
    ctx: ReturnType<typeof resolveActionInput<TData, Action<TData>>>,
    error: unknown,
    result: ActionResult,
): Promise<[OnSuccessOpts, ActionResult, TData]> {

    result.success = true

    switch (ctx.onSuccess) {
        case "abort": result.aborted = true; return ["abort", result, data]
        case "continue": return ["continue", result, data]
        default: {
            if (!ctx.onSuccess) return ["continue", result, data]
            const [perform, modData] = await ctx.onSuccess(data, ctx, ctx)
            switch (perform) {
                case "abort": result.aborted = true; return ["abort", result, modData]
                case "continue": return ["continue", result, modData]
            }
        }
    }

    // should never happen
    throw new Error(`Invalid onSuccess option ${ ctx.onSuccess.toString() }`)
}

async function actionError<TData>(
    data: TData,
    ctx: ReturnType<typeof resolveActionInput<TData, Action<TData>>>,
    error: unknown,
    result: ActionResult,
    noLog?: boolean
): Promise<[OnFailureOpts, ActionResult, TData]> {

    result.error = error
    result.success = false

    if (!noLog) { console.log(`\n\nError in action ${ ctx.type } at ${ ctx.path }: \n\t${ error }\n\n`) }
    switch (ctx.onFailure) {
        case "throw": throw error
        case "abort": result.aborted = true; return ["abort", result, data]
        case "continue": return ["continue", result, data]
        default: {
            if (!ctx.onFailure) throw error
            const [perform, modData] = await ctx.onFailure(data, ctx, ctx)
            switch (perform) {
                case "abort": result.aborted = true; return ["abort", result, modData]
                case "continue": return ["continue", result, modData]
                case "throw": throw error
            }
        }
    }

    // should never happen
    throw new Error(`Invalid onFailure option ${ ctx.onFailure.toString() }`)
}

async function ACTION_add<TData>(
    data: TData,
    config: ActionConfig_add<TData>,
    actionsConfig?: ActionsConfig<TData>,
): Promise<ActionReturn<TData>> {

    const result = actionResult()
    const ctx = resolveActionInput<TData, typeof config>(config, actionsConfig)

    try {
        // skip 
        if (!ctx.createFile) { result.success = true; result.skipped = true;["continue", result, data] }
        const fileExists = fs.existsSync(ctx.path)
        if (fileExists && ctx.skipIfExists) { result.success = true; result.skipped = true; return ["continue", result, data] }
        if (fileExists && !ctx.overwriteIfExists) { result.skipped = true; throw new Error(`File already exists at ${ ctx.path }`) }

        // resolve parent directory
        const parentExists = fs.existsSync(path.dirname(ctx.path))
        if (!ctx.createParent && !parentExists) { throw new Error(`Parent directory does not exist at ${ path.dirname(ctx.path) }`) }
        else if (ctx.createParent && !parentExists) {
            fs.mkdirSync(path.dirname(ctx.path), { recursive: true })
            result.createdParent = true
        }

        // create file
        const content = config.content ?? renderTemplate(data, ctx)
        fs.writeFileSync(ctx.path, content, { flag: "w" })
        if (!fileExists) { result.createdFile = true }


        return actionSuccess(data, ctx, null, result)
    }
    catch (error) { return actionError(data, ctx, error, result, ctx.noLog) }
}


export class FileActions<
    TData,
    TConfig extends ActionsConfig<TData> = ActionsConfig<TData>
> {

    private actions: Action<TData>[] = []

    constructor (
        private config: TConfig
    ) {
        this.config = config
    }

    push(action: Action<TData>) { this.actions.push(action) }

    async execute<TDataExec extends TData>(data: TDataExec) {

        const results: ActionResult[] = []

        let dataRef = data as TData

        for (const action of this.actions) {

            const [perform, result, modData] = await fileActions[action.type](dataRef, action, this.config)
            switch (perform) {
                case "continue": { results.push(result); dataRef = modData; break }
                case "abort": return results
                case "throw": throw result.error
                default: throw new Error(`Invalid Action return for ${ action.type } with path ${ action.path }`)
            }
        }

        this.actions = []
    }
}




