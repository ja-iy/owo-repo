import type { SchemaPluginOptions } from 'sanity'

// general
import { CONTENT_OBJECT_urlSlug } from './content-objects/custom/url-slug/schema.@C'
import { CONTENT_OBJECT_link } from "./content-objects/custom/link/schema.@C"

// portable text
import { CONTENT_OBJECT_richText } from "./content-objects/custom/rich-text/schema.@C"
import { CONTENT_OBJECT_articleContent } from "./content-objects/custom/article-content/schema.@C"

// portable text components


// requires config



const SANITY_LIB_CONTENT_OBJECT_TYPES: SchemaPluginOptions['types'] = [

    CONTENT_OBJECT_urlSlug,
    CONTENT_OBJECT_link,

    CONTENT_OBJECT_richText,
    CONTENT_OBJECT_articleContent,

]

type OptionalComponents = {
    empty?: never
}
export const LIB_SANITY_SCHEMA = (input?: OptionalComponents) => {


    return {
        types: SANITY_LIB_CONTENT_OBJECT_TYPES
    } satisfies SchemaPluginOptions

}
