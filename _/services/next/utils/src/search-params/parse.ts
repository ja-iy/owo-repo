import { z } from "zod"
import { parse as parseQueryString } from "querystring"
import { parseIntOrError } from "@repo/ts-utils/number"


export function parseSearchParams<
    TSearchParamsRaw extends Record<string, unknown> | Parameters<typeof parseQueryString>[0],
    TSearchParamsSchema extends z.ZodTypeAny //NEEDS-FIX: this should be a zod object whose values are searchParamHelpers return types
>(
    rawParams: TSearchParamsRaw | null | undefined,
    searchParamsSchema: TSearchParamsSchema,
):ReturnType<TSearchParamsSchema['parse']>{  
    if (rawParams === null || typeof rawParams === "undefined") return searchParamsSchema.parse({})
    return searchParamsSchema.parse( typeof rawParams === "string" ? parseQueryString(rawParams) : rawParams )
}

export const searchParamSchemaHelpers = {
    str: stringSchema,
    num: numberSchema,
    bool: booleanSchema,
    enum: enumSchema,
    arr: {
        str: stringArraySchema,
        num: numberArraySchema,
    }
} as const

export const spsh = searchParamSchemaHelpers

// type AcceptedPipeLines = 
//     | ReturnType<typeof stringSchema> 
//     | ReturnType<typeof numberSchema>
//     | ReturnType<typeof booleanSchema>
//     | ReturnType<typeof enumSchema>
//     | ReturnType<typeof stringArraySchema>
//     | ReturnType<typeof numberArraySchema>

// function cretaeSearchParamsSchemas<
//     TShape extends Record<string, AcceptedPipeLines>,
//     TSearchParamsSchemas  extends z.ZodObject<TShape>
// >(searchParamsSchemas: TSearchParamsSchemas){
//     return searchParamsSchemas
// }


// string
const stringDefaultSchema = (defaultValue:string) => z.string().optional().catch(defaultValue).default(defaultValue)
const stringNoDefaultSchema = z.string().optional().or(z.null()).catch(null).default(null)
function stringSchema(): typeof stringNoDefaultSchema
function stringSchema(defaultValue:string): ReturnType<typeof stringDefaultSchema>
function stringSchema(defaultValue?:string){
    return typeof defaultValue !== "undefined" ? stringDefaultSchema(defaultValue) : stringNoDefaultSchema
}

// number
const numberDefaultSchema = (defaultValue:number) => z.string().optional().pipe(z.coerce.number()).catch(defaultValue).default(defaultValue)
const numberNoDefaultSchema = z.string().pipe(z.coerce.number()).or(z.null()).catch(null).default(null)
function numberSchema(): typeof numberNoDefaultSchema
function numberSchema(defaultValue:number): ReturnType<typeof numberDefaultSchema>
function numberSchema(defaultValue?:number){
    return typeof defaultValue !== "undefined" ? numberDefaultSchema(defaultValue) : numberNoDefaultSchema
}

// boolean
const booleanDefaultSchema = (defaultValue:boolean) => z.union([z.literal('true'), z.literal('false')]).transform(v => v === 'true' ? true : false).optional().catch(defaultValue).default(defaultValue)
const booleanNoDefaultSchema = z.union([z.literal('true'), z.literal('false')]).transform(v => v === 'true' ? true : false).nullable().optional().catch(null).default(null)
function booleanSchema(): typeof booleanNoDefaultSchema
function booleanSchema(defaultValue:boolean): ReturnType<typeof booleanDefaultSchema>
function booleanSchema(defaultValue?:boolean){
    return typeof defaultValue !== "undefined" ? booleanDefaultSchema(defaultValue) : booleanNoDefaultSchema
}

// string array
const stringArrayDefaultSchema = (defaultValue:string[]) => z.string().transform(v=>v.split(',')).catch(defaultValue).default(defaultValue)
const stringArrayNoDefaultSchema = z.string().transform(v=>v.split(',')).nullable().catch(null).default(null)
function stringArraySchema(): typeof stringArrayNoDefaultSchema
function stringArraySchema(defaultValue:string[]): ReturnType<typeof stringArrayDefaultSchema>
function stringArraySchema(defaultValue?:string[]){
    return typeof defaultValue !== "undefined" ? stringArrayDefaultSchema(defaultValue) : stringArrayNoDefaultSchema
}

// number array
const numberArrayDefaultSchema = (defaultValue:number[]) => z.string().transform(v=>{
    try { return v.split(',').map(v=>parseIntOrError(v)) }
    catch (err) { return defaultValue }
}).catch(defaultValue).default(defaultValue)
const numberArrayNoDefaultSchema =  z.string().transform(v=>{
    try { return v.split(',').map(v=>parseIntOrError(v)) }
    catch (err) { return null }
}).nullable().catch(null).default(null)
function numberArraySchema(): typeof numberArrayNoDefaultSchema
function numberArraySchema(defaultValue:number[]): ReturnType<typeof numberArrayDefaultSchema>
function numberArraySchema(defaultValue?:number[]){
    return typeof defaultValue !== "undefined" ? numberArrayDefaultSchema(defaultValue) : numberArrayNoDefaultSchema
}

// string enum
function enumDefaultSchema<const TValues extends readonly [string, ...string[]]>(values: TValues, defaultValue:TValues[number]) { return z.enum(values).catch(defaultValue).default(defaultValue) }
function enumNoDefaultSchema<const TValues extends readonly [string, ...string[]]>(values: TValues, ) { return z.enum(values).nullable().catch(null).default(null) }
function enumSchema<const TValues extends readonly [string, ...string[]]>(values: TValues): ReturnType<typeof enumNoDefaultSchema<TValues>>
function enumSchema<const TValues extends readonly [string, ...string[]]>(values: TValues, defaultValue: TValues[number]): ReturnType<typeof enumDefaultSchema<TValues>>
function enumSchema<const TValues extends readonly [string, ...string[]]>(values: TValues, defaultValue?: TValues[number]){
    return typeof defaultValue !== "undefined" ? enumDefaultSchema(values, defaultValue) : enumNoDefaultSchema(values)
}





