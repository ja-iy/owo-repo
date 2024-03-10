import { q, z } from "groqd"
import type { Selection } from "groqd"

export const markDefExtension = q.object({
    _key: q.string().optional(),
})

type MarkDefs = Parameters<typeof q.contentBlock>[0]["markDefs"]

export function markDef<
    TMark extends MarkDefs,
>(mark:TMark):MarkDefs{
    if ( mark instanceof z.ZodObject) {
        return mark.merge(markDefExtension)
    }
    return mark  
}

export const SANITY_TYPE_FILTERS = {
    base: <TType extends string>(type: TType) => `_type == "${type}"` as const,
    published: <TType extends string>(type: TType) => `_type == "${type}" && !(_id in path("drafts.**"))` as const,
} as const

export const SANITY_PARAM_FILTERS = {
    type: <TType extends string>(type: TType) => `_type == ${type}` as const,
    _id: `_id == $_id`,
    slug: `slug.current == $slug`,
} as const


export type Q_Item = Selection[string] | ((...args:any[]) => Selection[string])
export type Q_Items = Record<string,  Q_Item>
