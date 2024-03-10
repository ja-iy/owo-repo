import { q } from "groqd"

import type { UnionToGroqdLiteral } from "../types"
import type { UnionToTuple } from "@repo/ts-utils/types"

export function q_union<
    const TArr extends string[] | readonly string[],
>(arr:TArr){

    if (arr.length < 2) return q.literal(arr[0] as TArr[0])

    type AllowedArr = TArr extends infer R 
        ? R extends readonly [string, string, ...string[]] ? R : never 
        : never

    type AllowedInner = UnionToTuple<UnionToGroqdLiteral<AllowedArr[number]>> extends infer R 
        ? R extends [any, any, ...any[]] ? R : never 
        : never

    const inner = arr.map((k => q.literal(k))) as unknown as AllowedInner
    return q.union(inner)
}
