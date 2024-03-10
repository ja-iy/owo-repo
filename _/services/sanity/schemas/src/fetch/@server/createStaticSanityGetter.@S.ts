
import { q } from "groqd"

import { SANITY_TYPE_FILTERS, SANITY_PARAM_FILTERS } from "@repo/groqd-utils"
import { minifyGroqQuery, transformToValidSanityFetchTag } from "./utils"

import type { InferType, Selection } from "groqd"
import type { SanityClient } from "next-sanity"
import type { AppContentItem, AppContentItemInternal, AppContentMeta } from "@repo/app-content-config"
import type { JoinRecordValuesToString, Overwrite, Reformat } from "@repo/ts-utils/types"
import type { SanityFetchOpts } from "./utils"


const defaults = {
    method: 'get' satisfies SanityFetchOpts['method'],
    cahce: 'force-cache' satisfies SanityFetchOpts['cache'],
    perspective: 'published' satisfies SanityFetchOpts['perspective'],
    // timeout: 1000 * 60 * 2 satisfies SanityFetchOpts['timeout'],
} as const


export function createStaticSanityGetter<
    TConfigItem extends AppContentItem,
    const TFilterParams extends Record<string, string> | undefined,
    TSelection extends Selection,
    TFetchTag extends TConfigItem['fetchTags'][number],
    TCahceTags extends TConfigItem['cacheTags'][number][],
// TId extends TFilterParams[TConfigItem['idKey']] extends infer R ? R extends string ? true : false : never,
>(
    sanity: SanityClient,
    input: {
        config: TConfigItem,
        filterParams?: TFilterParams,
        selection: TSelection,
        fetchTag?: TFetchTag,
        cacheTags?: TCahceTags,
    }
) {

    type FilterParams = TFilterParams //typeof input['filterParams']

    const { config, filterParams, selection } = input

    const filters = []
    for (const key in filterParams) { filters.push(filterParams[key]) }
    type FiltersString = JoinRecordValuesToString<NonNullable<TFilterParams>, ' '>
    const filter = `${ SANITY_TYPE_FILTERS.published(config.name as TConfigItem['name']) } ${ filters.join(' ') as FiltersString }` as const

    const { query, schema } = q('*')
        .filter(filter)
        .grab(selection)

    const minQuery = minifyGroqQuery(query)

    async function getter(...args: (FilterParams extends Record<string, unknown> ? [params:Record<keyof TFilterParams, string>] : [undefined?])) {

        const params = args[0]
        const idKey = config.idKey
        const id = params?.[idKey]

        const fetchTag = input.fetchTag ?? (typeof config.defaultFetchTag === 'function' ? config.defaultFetchTag(id) : config.defaultFetchTag)

        const cacheTags = [
            ...(typeof config.defaultCacheTags === 'function' ? config.defaultCacheTags(id) : config.defaultCacheTags),
            ...(input.cacheTags ?? []),
        ]

        const data = await sanity.fetch(query, params, {
            method: defaults.method,
            tag: transformToValidSanityFetchTag(fetchTag),
            cache: defaults.cahce,
            next: { tags: cacheTags },
            perspective: defaults.perspective,
            // timeout: defaults.timeout,
        })

        const parsedData = schema.safeParse(data)

        console.log('sanity - ', fetchTag, parsedData.success
            ? {
                success: parsedData.success,
                // data: parsedData.data,
            }
            : {
                success: parsedData.success,
                rawData: data,
                error: parsedData.error,
            }
        )

        if (!parsedData.success) throw new Error(`sanity - ${ fetchTag } - Invalid Return Shape : ${ parsedData.error }`)

        return parsedData.data
    }

    // add meta data here if necessary
    // if (config.meta) { ... }

    const result = {
        config: config,
        filter: filter,
        query: minQuery,
        schema: schema,
        getter: getter,
    }



    return result 

}




