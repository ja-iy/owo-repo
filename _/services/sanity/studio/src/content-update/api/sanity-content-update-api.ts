import { createTsApiCaller } from "@repo/ts-api-simple/create"

import type { Api_Cms_Sanity_RevalidateTag } from "../api/revalidate-tag/route"


// typed helpers which call our api routes

export const sanityStudioContentUpdateApi = {


    // revalidate a cache tag
    "revalidate-tag": createTsApiCaller<Api_Cms_Sanity_RevalidateTag>(
        '/cms/sanity/content-update/api/revalidate-tag', 
        (input, opts) => ({
            method: 'POST',
            headers:{
                Authorization: `Bearer ${opts.authToken}`
            }
        })
    ),

}

export type SanityStudioContentUpdateApi = typeof sanityStudioContentUpdateApi