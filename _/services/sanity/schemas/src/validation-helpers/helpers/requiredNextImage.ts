import type { Rule } from "sanity"

import type { ImageValue } from "sanity"

export function requiredNextImage(rule:Rule){
    return rule.custom<ImageValue & {alt:string}>((value, context) =>{

        if (!value.asset) { return 'Required' }
        return true
    })
}