import { narrowObject, removeFromObject } from "@repo/ts-utils/object"

import type { Selection } from 'groqd'


export function removeFromSelection<
    TSelection extends Selection,
    TRemove extends Array<keyof TSelection>,
>(
    selection: TSelection,
    remove: TRemove,
) {

    return removeFromObject(selection, remove)
}

type RemoveFromSelection<
    TSelection extends Selection,
    TRemove extends Array<keyof TSelection>,
> = Omit<TSelection, TRemove[number]>


export function narrowSelection<
    TSelection extends Selection,
    TSelect extends Array<keyof TSelection>,
>(
    selection: TSelection,
    select: TSelect,
) {

    return narrowObject(selection, select)
}

type NarrowSelection<
    TSelection extends Selection,
    TSelect extends Array<keyof TSelection>,
> = Pick<TSelection, TSelect[number]>


