import { q } from 'groqd'

// export const q_refrenceArray = <T extends  Parameters<typeof q.array>[0]>(schema:T) => q.union([q.null(), q.array(schema)])

import { SANITY_PARAM_FILTERS } from '../../utils'
import type { Selection } from 'groqd'


export const q_refrenceArray = <
    TName extends string,
    TQuery extends string,
    TSchema extends Parameters<typeof q.array>[0]
>(
    name: TName,
    query: TQuery,
    schema: TSchema,
) => [
    `${ name }[]->${ query }`,
    q.union([q.null(), q.array(schema)])
    // q.array(schema).optional().nullable()
] satisfies Selection[string]