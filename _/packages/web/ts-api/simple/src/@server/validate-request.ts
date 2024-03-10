import type { NextRequest } from 'next/server'
import type { z } from 'zod'

import { HTTP_METHODS_WITH_BODY } from '@repo/ts-utils/http'

import { tsApiResult } from './api-result'


export async function validateTsApiRequest<
    TSchema extends z.AnyZodObject
>(
    req: Request,
    schema: TSchema,
    opts?: {
        internal?: boolean,
    }
) {

    let data
    try { data = await simpleRequestDataExtractor(req) }
    catch (e) { return { error: tsApiResult({ success: false, error: String(e) }, { status: 400 }) } }

    const input = schema.safeParse(data)
    if (!input.success) return { error: tsApiResult({ success: false, error: input?.error.errors[0]?.message ?? 'invalid-body' }, { status: 400 }) }

    return { result: input.data as z.infer<TSchema> }
}

async function simpleRequestDataExtractor(req: Request) {

    const body = HTTP_METHODS_WITH_BODY.has(req.method ?? 'GET')
        ? await bodyFromRequest(req)
        : await paramsFromRequest(req)

    return body
}

async function paramsFromRequest(req: Request) {
    return Object.fromEntries(new URL(req.url).searchParams.entries())
}

async function bodyFromRequest(req: Request) {

    try {
        const contentType = req.headers.get('content-type')

        if (contentType && contentType !== 'application/json') {
            const message = 'validateRequest currently only works for content-type: application/json, please update the function, or implement a diffrent request validator'
            console.log(message)
            throw new Error(message)
        }

        return await req.json()
    }

    catch (e) {
        console.log('error parsing body', e)
        throw 'body-parser-error'
    }
}

