import z from "zod"

import type { UnionToTuple} from "../../types"


export function z_enum<
    const TArr extends string[] | readonly string[]
>(
    input: TArr
) {

    const enumInput = input as UnionToTuple<TArr[number]> extends infer R
        ? R extends [string, ...string[]] | readonly [string, ...string[]] ? R : never
        : never

    return z.enum(enumInput)
}


export const cz = {

    enum: z_enum,

}