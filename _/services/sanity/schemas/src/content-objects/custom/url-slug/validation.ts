import groq from "groq"
import { q } from "groqd"

import type { Selection, InferType } from "groqd"


export const GROQ_urlSlug = <TName extends string>(name: TName) => groq`${ name }.current`

export const Q_urlSlug = q.string()

export const Q_ITEM_urlSlug = (name: string) => [GROQ_urlSlug(name), Q_urlSlug] satisfies Selection[string]


export type SanityUrlSlugValue = InferType<typeof Q_urlSlug>