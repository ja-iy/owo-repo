import type { UnionToIntersection } from "type-fest"

// NOTE: Only use these types when you know it is valid to do so / want to force a type for display purposes


// UNION TO TUPLE //

type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

type Push<T extends any[], V> = [...T, V]

export type UnionToTuple<
    T,
    L = LastOf<T>,
    N = [T] extends [never] ? true : false
> =
    true extends N
    ? []
    : Push<UnionToTuple<Exclude<T, L>>, L>

// type UnionToIntersection<Union> = (
// 	Union extends unknown ? (distributedUnion: Union) => void : never
// ) extends ((mergedIntersection: infer Intersection) => void)
// 	? Intersection & Union
// 	: never;

// type LastOfUnion<Union> = UnionToIntersection<Union extends any ? () => Union : never> extends () => (infer R) ? R : never

// type PushToTuple<T extends any[], V> = [...T, V]

// export type UnionToTuple<
//     Union,
//     Last = LastOfUnion<Union>,
//     Next = [Union] extends [never] ? true : false
// > =
//     true extends Next ? [] : PushToTuple<UnionToTuple<Exclude<Union, Last>>, Last>


// JOIN TUPLE

export type JoinTuple<
    T extends readonly string[] | string[],
    Join extends string,
> = T extends readonly string[]
    ? T extends [infer First, ...infer Rest]
        ? First extends string 
            ? Rest extends readonly string[] | string[]
                ? `${First}${Rest extends [] ? '' : Join}${JoinTuple<Rest, Join>}`
                : never
            : never
        : ''
    : never


// Record <string, string> TO JOINED STRING //
export type JoinRecordValuesToString<
    T extends Record<string, string>,
    Join extends string,
    TTuple extends readonly string[] | string[] = UnionToTuple<T[keyof T]> extends infer R ? R extends readonly  string[] ? R : never : never,
> = JoinTuple<TTuple, Join>


// RECORD TO QUERY STRING //

type RecordToQueryStringArray<T extends Record<string, string>> = UnionToTuple<{
    [K in keyof T]: `${Extract<K, string>}=${T[K]}`
}[keyof T]> extends infer R ? R extends string[] ? R : never : never

type JoinWithAmpersand<T extends string[]> = T extends []
    ? ""
    : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
    ? F extends string
    ? R extends string[]
    ? `${F}&${JoinWithAmpersand<R>}`
    : never
    : never
    : string;

export type RecordToQueryString<T extends Record<string, string>> = JoinWithAmpersand<RecordToQueryStringArray<T>> extends infer R ? R extends string ? `?${R}` : never : never