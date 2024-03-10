import type { Selection } from "groqd"
import type { lsn } from "./names";

// link
import { GROQ_link, Q_link, Q_ITEM_link, type SanityLinkValue } from "./content-objects/custom/link/validation"
export { GROQ_link, Q_link, Q_ITEM_link, }
export type { SanityLinkValue }

// richText
import {
    GROQ_richText,
    Q_richText,
    Q_richText_String, Q_richText_String_Optional,
    Q_richText_Compenent, Q_richText_Component_Optional,
    Q_richText_Parsed,
    Q_ITEMS_richText
} from "./content-objects/custom/rich-text/validation"
export { GROQ_richText, Q_richText, Q_richText_String, Q_richText_String_Optional, Q_richText_Compenent, Q_richText_Component_Optional as Q_richText_Optional_Compenent, Q_richText_Parsed, }
export type { SanityRichTextValue, SanityRichTextStringValue, SanityRichTextComponentValue, SanityRichTextParsedValue, SanityRichTextSubValues } from "./content-objects/custom/rich-text/validation";

// articleContent
import {
    GROQ_articleContent,
    Q_articleContent,
    Q_articleContent_String, Q_articleContent_String_Optional,
    Q_articleContent_Compenent, Q_articleContent_Compenent_Optional,
    Q_articleContent_Parsed,
    Q_ITEMS_articleContent
} from "./content-objects/custom/article-content/validation"
import type { 
    ArticleContentValue as SanityArticleContentValue, 
    ArticleContentStringValue as SanityArticleContentStringValue,
    ArticleContentComponentValue as SanityArticleContentComponentValue,
    ArticleContentParsedValue as SanityArticleContentParsedValue,
} from "./content-objects/custom/article-content/validation";
export type {
    SanityArticleContentValue,
    SanityArticleContentStringValue,
    SanityArticleContentComponentValue,
    SanityArticleContentParsedValue,
}

// urlSlug
import { GROQ_urlSlug, Q_urlSlug, Q_ITEM_urlSlug, type SanityUrlSlugValue } from "./content-objects/custom/url-slug/validation"
export { GROQ_urlSlug, Q_urlSlug, Q_ITEM_urlSlug, }
export type { SanityUrlSlugValue }

export type SanityOptionalArray<T> = Array<T>|null|undefined



export const lcq = {

    link: {
        query: GROQ_link,
        schema: Q_link,
        item: Q_ITEM_link,
    },

   

    richText: {
        query: GROQ_richText, schema: Q_richText,
        string: { query: GROQ_richText, schema: Q_richText_String, item: Q_ITEMS_richText.string, },
        stringOptional: { query: GROQ_richText, schema: Q_richText_String_Optional, item: Q_ITEMS_richText.stringOptional, },
        component: { query: GROQ_richText, schema: Q_richText_Compenent, item: Q_ITEMS_richText.component },
        componentOptional: { query: GROQ_richText, schema: Q_richText_Component_Optional, item: Q_ITEMS_richText.componentOptional },
        parsed: { query: GROQ_richText, schema: Q_richText_Parsed, },
    },

    articleContent: {
        query: GROQ_articleContent, schema: Q_articleContent,
        string: { query: GROQ_articleContent, schema: Q_articleContent_String, item: Q_ITEMS_articleContent.string },
        stringOptional: { query: GROQ_articleContent, schema: Q_articleContent_String_Optional, item: Q_ITEMS_articleContent.stringOptional },
        component: { query: GROQ_articleContent, schema: Q_articleContent_Compenent, item: Q_ITEMS_articleContent.component },
        componentOptional: { query: GROQ_articleContent, schema: Q_articleContent_Compenent_Optional, item: Q_ITEMS_articleContent.componentOptional },
        parsed: { query: GROQ_articleContent, schema: Q_articleContent_Parsed, },
    },

   

    urlSlug: {
        query: GROQ_urlSlug,
        schema: Q_urlSlug,
        item: Q_ITEM_urlSlug,
    },

   


} as const satisfies LibCustomGroqd


type LibCustomGroqd = Partial<Record<LibCustomGroqdKey, LibCustomGroqdItem>>
type LibCustomGroqdKey = keyof typeof lsn
type LibCustomGroqdItem =
    | { query?: unknown, schema?: unknown, item?: unknown } & { [key: string]: { query?: unknown, schema?: unknown, item?: unknown } }
    | Record<string, { query?: unknown, schema?: unknown, item?: unknown }> 


