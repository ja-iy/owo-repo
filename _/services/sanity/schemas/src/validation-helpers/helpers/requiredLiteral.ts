import type { Rule } from 'sanity'

export const requiredLiteral = (Rule:Rule, value:string, label?:string,) => Rule.custom((field) => field === value || `${label ? `${label} m`: 'M'}ust be '${value}'.`)
