import { q } from 'groqd'

export const q_DefaultBoolean = <const TDefault extends boolean>(defaultValue:TDefault) => q.boolean().nullable().optional().transform(q_SetDefault_experimental(defaultValue))

//doesnt work for some complex types (works for boolean)
export const q_SetDefault_experimental = <const TDefault>(defaultValue:TDefault) => <const TVal>(value:TVal) => typeof value === 'undefined' || value === null  ? defaultValue : value