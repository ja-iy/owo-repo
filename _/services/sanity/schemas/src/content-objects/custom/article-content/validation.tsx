import { q, sanityImage, type InferType } from "groqd"
import groq from "groq"

import { markDefExtension } from "@repo/groqd-utils"
import type { Q_Items } from "@repo/groqd-utils"

import { ArticleContent } from "./components/article-content"
import type { ArticleContentOpts } from "./components/article-content"
import { toPlainText } from '@portabletext/react'

import { Q_link } from "../link/validation"

export const GROQ_articleContent = <TName extends string>(name: TName) => groq`${ name }`

const articleContentSubSchemas = {

    block: q.contentBlock({
        markDefs: Q_link.merge(markDefExtension)
    }),

    image: sanityImage('image').schema.transform(v=> ({...v, _key: v._key ?? 'image'}))

}

export const Q_articleContent = q.array(
    q.union([
        articleContentSubSchemas.block,
        articleContentSubSchemas.image
    ])
)


export const Q_articleContent_String = Q_articleContent.transform(value => toPlainText(value))
export const Q_articleContent_String_Optional = Q_articleContent.nullable().optional().transform(value => value ? toPlainText(value) : null)
export const Q_articleContent_Compenent = (opts?: ArticleContentOpts) => Q_articleContent.transform(value => <ArticleContent value={ value } { ...opts } />)
export const Q_articleContent_Compenent_Optional = (opts?: ArticleContentOpts) => Q_articleContent.nullable().optional().transform(value => value ? <ArticleContent value={ value } { ...opts } /> : null)
export const Q_articleContent_Parsed = (opts?: { component: ArticleContentOpts }) => Q_articleContent.transform(value => ({ component: <ArticleContent value={ value } { ...opts?.component } />, string: toPlainText(value) }))

export const Q_ITEMS_articleContent = {
    string: <TName extends string>(name: TName) => [GROQ_articleContent(name), Q_articleContent_String],
    stringOptional: <TName extends string>(name: TName) => [GROQ_articleContent(name), Q_articleContent_String_Optional],
    component: <TName extends string, TOpts extends ArticleContentOpts>(name: TName, opts: TOpts) => [GROQ_articleContent(name), Q_articleContent_Compenent(opts)],
    componentOptional: <TName extends string, TOpts extends ArticleContentOpts>(name: TName, opts: TOpts) => [GROQ_articleContent(name), Q_articleContent_Compenent_Optional(opts)],
} satisfies Q_Items

export type ArticleContentSubValues = {
    [K in keyof typeof articleContentSubSchemas]: InferType<typeof articleContentSubSchemas[K]>
}
export type ArticleContentValue = InferType<typeof Q_articleContent>
export type ArticleContentStringValue = InferType<typeof Q_articleContent_String>
export type ArticleContentComponentValue = InferType<ReturnType<typeof Q_articleContent_Compenent>>
export type ArticleContentParsedValue = InferType<typeof Q_articleContent_Parsed>