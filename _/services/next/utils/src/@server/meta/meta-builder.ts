import { metaNoIndex } from "./meta-no-index"
import { env } from "../../env.mjs"
import { getSiteUrl } from "../../@common"
import { objectEntries } from "@repo/ts-utils/object"

//types
import type { Metadata, ResolvingMetadata } from "next"

type BaseParams = Record<string, string>
type BaseSearchParams = Record<string, string | string[] | undefined>

type BuilderInput<
    TParams extends BaseParams, 
    TSearchParams, //extends BaseSearchParams, 
    TParent extends ResolvingMetadata, 
> = { 
    routePath:`/${string}` | ( (params: TParams, parent?: TParent) => `/${string}` ),
    autoSetCanonicalUrl?:boolean,
}

const defaultBuilderInput = {
    autoSetCannon: true,
}

export type BuilderOutput = { 
    routePath: `/${string}`,
    routeUrl: string,
}

const metaErrors = {
    not_found: metaNoIndex 
}

export function metaBuilder<
    TRouteProps extends { params: TParams, searchParams?: TSearchParams },
    TParams extends Record<string, string> = TRouteProps["params"],
    TSearchParams extends Record<string, string | string[] | undefined> | undefined = TRouteProps["searchParams"],
>(
    innerGen: ( 
        builderOutput: BuilderOutput,
        errors: typeof metaErrors,
        routeProps:TRouteProps, 
        parent:ResolvingMetadata,     
    ) => Promise<Metadata|undefined>,
){

    if (env.devOnly.get('NEXT_PUBLIC_DEV_MODE_NO_BUILD_METADATA')){
        // console.log(`metaBuilder: Dev mode, no build metadata`, env.NEXT_PUBLIC_DEV_MODE_NO_BUILD_METADATA)
        return (input: BuilderInput<TParams, TSearchParams, ResolvingMetadata>) => {

            return async (
                routeProps:TRouteProps, 
                parent:ResolvingMetadata
            ): Promise<Metadata|undefined> => ({})
        }
    }

    return (input: BuilderInput<TParams, TSearchParams, ResolvingMetadata>) => {

        return async (
            routeProps:TRouteProps, 
            parent:ResolvingMetadata
        ): Promise<Metadata> => {


            const { params, searchParams } = routeProps


            // build output
            const routePath = typeof input.routePath === "function"
                ? input.routePath(params, parent)
                : input.routePath

            const routeUrl = `${getSiteUrl()}${routePath}`
            // const fullMobileUrl = `${getSiteUrl()}${routePath}/mobile/`

            const output = {
                routePath,
                routeUrl,
            }

            // defaults
            const autoSetCanonicalUrl = typeof input.autoSetCanonicalUrl === "boolean" ? input.autoSetCanonicalUrl : defaultBuilderInput.autoSetCannon

            // merge meta data resolvers
            const customMeta = await innerGen(output, metaErrors, routeProps, parent)

            if (customMeta === undefined){ return undefined as unknown as Metadata } //NEEDS-FIX: temp solution
            const {
                alternates,
                openGraph,
                twitter,
                ...metadata
            } = customMeta

            const canonicalUrl = alternates?.canonical ?? routeUrl
            const canonicalUrlString = typeof canonicalUrl === "string" ? canonicalUrl : routeUrl


            // determine meta data from siteData, output and resolvers
            const metadataResult:Metadata = filterMetaData({

                ...metadata,

            })

            metadataResult.alternates = autoSetCanonicalUrl
                ? { 
                    ...alternates,
                    canonical: canonicalUrl,
                    // media: alternates?.media //?? { [`only screen and (max-width: ${MOBILE_WIDTH}px)`]: fullMobileUrl },
                }
                : alternates
                
            if (openGraph){
                metadataResult.openGraph = {
                    
                    type: "website",

                    ...openGraph,

                    locale: openGraph.locale ?? "en_US",
                    url: openGraph.url ?? canonicalUrlString,
                }
            }

            if (twitter){
                metadataResult.twitter = {
                    ...twitter,
                }
            }

            // console.log(`Built Metadata for: `, params, metadataResult)

            return metadataResult
        }
    }
}


// function metaBuilderDevEmpty(
//     input: BuilderInput<any, any, ResolvingMetadata>,
// ){
//     return async (
//         routeProps:any, 
//         parent:ResolvingMetadata
//     ): Promise<Metadata> => {
//         return {}
//     }
// }


function filterMetaData(meta:Metadata){
    for (const [key, value] of Object.entries(meta)){
        if (typeof value === "undefined" || value === null){
            delete meta[key as keyof Metadata]
        }
    }
    return meta
}