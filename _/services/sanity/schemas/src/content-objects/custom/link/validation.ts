import { q, type Selection } from "groqd"
import groq from "groq"

//types
import type { InferType } from "groqd"

export const GROQ_link = <TName extends string>(name:TName) => groq`${name}`

export const Q_link = q.object({
    _type: q.literal('link'),
    href: q.string(),
    blank: q.boolean(),
})

export const Q_ITEM_link = (name: string) => [GROQ_link(name), Q_link] satisfies Selection[string]


export type SanityLinkValue = InferType<typeof Q_link>