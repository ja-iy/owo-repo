import type { Selection } from 'groqd'


export function createSelection<
    TSelection extends Selection,
>(
    selection: TSelection,
) {

    return selection
}
