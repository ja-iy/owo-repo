export type SharedKeysWithSameType<T, U> = {
    [K in Extract<keyof T, keyof U>]: T[K] extends U[K] ? T[K] : never;
}