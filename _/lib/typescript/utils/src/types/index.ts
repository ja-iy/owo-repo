// general //
export type * from "./general"

// array //
export type * from "./array"


// string //
export type { RelativePath } from "./string/RelativePath"
export type { LiteralOrString } from "./string/LiteralOrString"


// dev-tools //
export type { PackageJson } from "./dev-tools/PackageJson"


// formatters //


// unstable //

export type * from "./unstable"


// global

export type Overwrite<T, U> = Reformat<Pick<T, Exclude<keyof T, keyof U>> & U>

export type MergeObjectArray<T extends object[]> = T extends [infer First, ...infer Rest]
    ? Rest extends object[] 
        ? Overwrite<First, MergeObjectArray<Rest>>
        : object
    : object

export type Reformat<T> = { [K in keyof T]: T[K] } & NonNullable<unknown>

export type Refine<T, U extends T> = T extends U ? T : never
export type RefineOut<T, U extends T> = T extends U ? never : T

export type TypeFrom<T, U extends Record<keyof T, unknown>> = { [K in keyof U]: U[K] }
export type TypeFromRetain<T, U extends Partial<Record<keyof T, unknown>>> = Reformat<Overwrite<T, U>>

