import { q, type InferType } from "groqd"
import groq from "groq"
import { toPlainText } from '@portabletext/react'


import { markDefExtension } from "@repo/groqd-utils"
import type { Q_Items } from "@repo/groqd-utils"


import { SanityRichText } from "./components/sanity-rich-text"
import type { SanityRichTextOpts } from "./components/sanity-rich-text";

import { Q_link } from "../../../content-objects/custom/link/validation"


export const GROQ_richText = <TName extends string>(name: TName) => groq`${ name }`

const richTextSubSchemas = {

    block: q.contentBlock({
        markDefs: Q_link.merge(markDefExtension)
    }),
}

export const Q_richText = q.array(
    richTextSubSchemas.block,
)

export const Q_richText_String = Q_richText.transform(value => toPlainText(value))
export const Q_richText_String_Optional = Q_richText.nullable().optional().transform(value => value ? toPlainText(value) : null)
export const Q_richText_Compenent = (opts?: SanityRichTextOpts) => Q_richText.transform(value => <SanityRichText value={ value } { ...opts } />)
export const Q_richText_Component_Optional = (opts?: SanityRichTextOpts) => Q_richText.nullable().optional().transform(value => value ? <SanityRichText value={ value } { ...opts } /> : null)
export const Q_richText_Parsed = (opts?: { component?: SanityRichTextOpts }) => Q_richText.transform(value => ({ component: <SanityRichText value={ value } { ...opts?.component } />, string: toPlainText(value) }))

export const Q_ITEMS_richText = {
    string: <TName extends string>(name: TName) => [GROQ_richText(name), Q_richText_String],
    stringOptional: <TName extends string>(name: TName) => [GROQ_richText(name), Q_richText_String_Optional],
    component: <TName extends string>(name: TName, opts?: SanityRichTextOpts) => [GROQ_richText(name), Q_richText_Compenent(opts)],
    componentOptional: <TName extends string>(name: TName, opts?: SanityRichTextOpts) => [GROQ_richText(name), Q_richText_Component_Optional(opts)],
} satisfies Q_Items

export type SanityRichTextSubValues = {
    [K in keyof typeof richTextSubSchemas]: InferType<typeof richTextSubSchemas[K]>
}
export type SanityRichTextValue = InferType<typeof Q_richText>
export type SanityRichTextStringValue = InferType<typeof Q_richText_String>
export type SanityRichTextComponentValue = InferType<ReturnType<typeof Q_richText_Compenent>>
export type SanityRichTextParsedValue = InferType<typeof Q_richText_Parsed>