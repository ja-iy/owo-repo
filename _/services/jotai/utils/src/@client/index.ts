import type { WritableAtom } from 'jotai'

export type ReadWriteAtom<T> = WritableAtom<T, [update: ((currentValue:T) => T) | T], any>

export const extractUpdate = <
    TValue,
    TUpdate extends TValue | ((currentValue: TValue) => TValue) 
>(
    currentValue: TValue,
    update: TUpdate
):TValue => {

    return typeof update === 'function'
        ? update(currentValue)
        : update
}
