import '@repo/ts-globals'

export { }

declare global {

    type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U

    type Reformat<T> = { [K in keyof T]: T[K] } & NonNullable<unknown>

    type Refine<T, U extends T> = T extends U ? T : never
    type RefineOut<T, U extends T> = T extends U ? never : T

    type TypeFrom<T, U extends Record<keyof T, unknown>> = { [K in keyof U]: U[K] }
    type TypeFromRetain<T, U extends Partial<Record<keyof T, unknown>>> = Reformat<Overwrite<T, U>>

}

