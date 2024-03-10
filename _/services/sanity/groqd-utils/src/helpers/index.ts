import { q_union } from './primitives/q_union'
import { q_DefaultBoolean } from './primitives/qSetDefault'
import { q_refrenceArray } from './primitives/q_refrenceArray'

export const cq = {
    union: q_union,
    defaultBoolean: q_DefaultBoolean,
    refrenceArray: q_refrenceArray,
}

export { createSelection } from './primitives/createSelection'

export { 
    narrowSelection,
    removeFromSelection,
} from './primitives/modifySelection'

export { deconstructSelection } from './primitives/deconstructSelection'


export type { Selection, TypeFromSelection } from 'groqd'

export type * from './types'