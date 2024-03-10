import type { Reformat } from "@repo/ts-utils/types"
import { NextResponse } from "next/server"
import type { JsonObject, JsonValue } from "type-fest"

type JsonOptionalObject  = { [key:string]: JsonValue | undefined }

export type TacExpectedResponseBody =
    | 
        ({
            success: false,
            error?: JsonValue | JsonObject | undefined,
            knownError?: JsonValue | JsonObject | undefined,
        } & JsonOptionalObject) 
    
    | 
       ( {
            success: true,
        } & JsonObject)

export type TransformTacExpectedResponseBody<
        TResult extends TacExpectedResponseBody
> = TResult extends infer R 
    ? R extends { success: false } 
        ? R extends { success:false, error: JsonObject | JsonValue | undefined }
            ? Reformat<R & { knownError?:never }>
            : R extends { success:false, knownError: JsonObject | JsonValue | undefined }
                ? Reformat<R & { error?: never }>
                : R
        : R 
    : never

export function tsApiResult<
    const TResult extends TacExpectedResponseBody
>(
    body: TResult,
    init?: Parameters<typeof NextResponse['json']>[1]
){
    return NextResponse.json(body, init)
}
