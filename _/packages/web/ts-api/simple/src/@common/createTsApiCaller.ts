import type { NextResponse } from "next/server"
import type { JsonObject } from "type-fest"

import { getSiteUrl } from "@repo/next-utils/site-url"
import { HTTP_METHODS_WITH_BODY } from "@repo/ts-utils/http"
import type { TacExpectedResponseBody, TransformTacExpectedResponseBody } from "../@server/api-result"
import type { Overwrite } from "@repo/ts-utils/types"


// creates a typed api caller for our api endpoints

export function createTsApiCaller<
    T extends Api_CreateCallerGenerics,
>(
    path: T['path'],
    config: T['config'] | ((input: T['input'], opts:T['options']) => T['config']),
) {

    return async (
        input: T['input'],
        options: T['options'] = undefined
    ) => {

        // construct fetch

        const resolvedConfig = typeof config === 'function' ? config(input, options) : config

        let fetchConfig
        const url = new URL(path, getSiteUrl())

        if (HTTP_METHODS_WITH_BODY.has(resolvedConfig?.method ?? 'GET')) {
            fetchConfig = {
                ...resolvedConfig,
                body: JSON.stringify(input),
                headers: {
                    'content-type': 'application/json',
                    ...resolvedConfig?.headers,
                },
            }
        }
        else {
            fetchConfig = {
                ...resolvedConfig,
                headers: {
                    ...resolvedConfig?.headers,
                    'content-type': 'x-www-form-urlencoded',
                },
            }
            for (const [k, v] of Object.entries(input)) {
                url.searchParams.set(k, String(v))
            }
        }

        // perform fetch

        let output: T['output']
        try {
            const response = await fetch(url, fetchConfig)
            console.log('response', response)
            output = await response.json() as T['output']
            console.log('output', output)
            if (!output.success) {
                console.log(`\nTs API Failure: call to path: ${path} \n`, output?.knownError ?? output?.error ?? 'Unknown Failure', '\n', 'input: ', input, '\n')
            }
        }
        catch (e) {
            console.log(`\nUnknown Ts API Error: call to path: ${path} \n`, e, '\n', 'input: ', input, '\n')
            throw e
        }

        return output
    }
}

type Api_DefaultCreateCallerGenerics = {
    path: `/api/${string}` | `/${string}/api/${string}`
    input: JsonObject
    output: TacExpectedResponseBody
    config: RequestInit,
    serverOnly?: boolean,
    options: Record<string, unknown> | undefined
}

export type Api_CreateCallerGenerics<
    T extends Api_DefaultCreateCallerGenerics = Api_DefaultCreateCallerGenerics
> =
    Overwrite<T, {
        config: Overwrite<RequestInit, T['config']>,
        output: TransformTacExpectedResponseBody<T['output']>
    }>

export type InferBodyFromNextResponseReturn<
    T extends (...args: any[]) => Promise<NextResponse<unknown>>
> = Awaited<ReturnType<T>> extends NextResponse<infer Body> ? Body : never
