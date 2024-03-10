import type { Rule } from "sanity"

export function nonEmptyString(Rule:Rule, msg='Required'):Rule {
    return Rule
        .required().error(msg)
        .custom((field) => (field as string)?.trim() ? true : msg)    
}