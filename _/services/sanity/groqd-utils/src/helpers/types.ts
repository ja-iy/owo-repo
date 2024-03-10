import type { q } from "groqd"
import type { z } from "zod"

export type UnionToGroqdLiteral<U extends z.Primitive> = U extends z.Primitive
    ? ReturnType<typeof q.literal<U>>
    : never
