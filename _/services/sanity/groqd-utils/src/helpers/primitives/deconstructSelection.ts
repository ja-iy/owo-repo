import { q, BaseQuery } from 'groqd'

import { objectEntries } from '@repo/ts-utils/object'

import type { Selection } from 'groqd'
import type { Reformat } from '@repo/ts-utils/types'


export function deconstructSelection<
    TSelection extends Selection
>(
    selection: TSelection
) {
    type Shape = ShapeFromSelection<TSelection>

    const shape = { ...selection } as Selection

    let query = '{'

    for (const [k, v] of objectEntries(shape)) {
        if (Array.isArray(v)) {
            shape[k] = v[1]
            query += `"${ k }":${ v[0] },`
        }
        else if (v instanceof BaseQuery) {
            shape[k] = v['schema']
            query += `"${ k }":${ v['query'] },`
        }
        else {
            query += `${ k },`
        }
    }

    query += ' }'
    query = query.replace(/[ \t\n\r]+/g, '')

    const schema = q.object(shape as Shape)

    return [query, shape, schema] as [query: string, shape: Shape, schema: typeof schema]
}


type ShapeFromSelection<
    TSelection extends Selection,
    Shape = Reformat<ShapeFromSelectionInner<TSelection>>
> = Shape extends QObjectShape ? Shape : never


export type ShapeFromSelectionInner<TSelection extends Selection> = {
    [key in keyof TSelection]:
    TSelection[key] extends infer R
    ? R extends [string, any] ? R[1]
    : R extends { 'schema': any } ? R['schema']
    : R extends object ? R
    : never
    : never
}

type QObjectShape = Parameters<typeof q.object>[0]
type QObject<T extends QObjectShape> = ReturnType<typeof q.object<T>>

