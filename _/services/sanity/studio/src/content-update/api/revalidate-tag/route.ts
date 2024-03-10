import { NextResponse, type NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import type { Api_CreateCallerGenerics, InferBodyFromNextResponseReturn } from '@repo/ts-api-simple/create'

import { tacs } from '@repo/ts-api-simple/@server'
import { validateSanityStudioRequest } from '../../@server/utils.@S'


const inputSchema = z.object({ 
    tag: z.string().max(200),
})


const createPOST = (
    studioSecretsApiToken: string
) => async (req:NextRequest) => {

    const authResult = validateSanityStudioRequest(req, studioSecretsApiToken)
    if (authResult.missing) return tacs.result({ success: false, knownError: 'missing-auth-token' }, { status: 401 })
    if (!authResult.valid) return tacs.result({ success: false, knownError: 'invalid-auth-token' }, { status: 401 })

    const { result, error } = await tacs.validateRequest(req, inputSchema); if (error) { return error } ;
    const tag = result.tag

    // revalidate tag    
    try {        

        revalidateTag(tag)

        console.log(`\nSERVER - Revalidated Tag, \t tag: ${tag}`)

        return tacs.result({
            success: true,
            tag: tag,
            // now: Date.now()
        })
    }
    catch (error) {
        
        console.error(`\nSERVER - Error revalidating tag: ${tag}, \n`, error)
        return tacs.result({ success: false, error: String(error) }, { status: 500 })
    }
}

export const CREATE_POST__api_cms_sanity_revalidateTag = createPOST

export type Api_Cms_Sanity_RevalidateTag = Api_CreateCallerGenerics<{
    path: '/cms/sanity/content-update/api/revalidate-tag'
    input: z.infer<typeof inputSchema>,
    options: { authToken: string },
    config: { 
        method: 'POST', 
        contentType?: 'application/json',
        headers: {
            'Authorization': `Bearer ${string}`
        }
    },
    output: InferBodyFromNextResponseReturn<ReturnType<typeof createPOST>>
}>

