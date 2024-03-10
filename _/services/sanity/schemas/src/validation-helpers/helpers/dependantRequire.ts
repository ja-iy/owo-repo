
import type { Rule } from 'sanity'

type FieldCheck = 
    [ string, ((item:any) => boolean) ] | 
    string

export const dependantRequire = (label:string, Rule:Rule, fieldsToCheck:FieldCheck[]|readonly FieldCheck[], action:'error'|'warn'='error', ignoreIfSet: FieldCheck[] = []):Rule => {
    
    const validation = Rule.custom((field, {document}) => {
        
        const errMsg = `Required as a field has been set in: ${label}`
        let fieldIsNotDefined:boolean

        switch (typeof field) {
            case 'string': fieldIsNotDefined = !field.trim(); break;
            case 'boolean': fieldIsNotDefined = false; break;
            case 'object': {
                const fieldObj = field as Record<string,unknown>
                if (fieldObj?._type && fieldObj._type === 'nextImage') fieldIsNotDefined = !fieldObj.asset
                else if (fieldObj?._type && fieldObj._type === 'image') fieldIsNotDefined = !fieldObj.asset
                else fieldIsNotDefined = !field
                break;
            }
            default: fieldIsNotDefined = field === null ? false : !field
        }

        for ( const field of ignoreIfSet ) {
            if (typeof field === 'string') {
                const item = document?.[field]
                // console.log({item, fieldToCheck, fieldIsNotDefined})
                switch (typeof item) {
                    // @ts-expect-error : fallthough case
                    case 'string': if (item.trim()) return true; //+ `: ${fieldToCheck}`
                    default: if (item) return true //+ `: ${fieldToCheck}`
                }
            }
            else {
                const [fieldName, check] = field
                const item = document?.[fieldName]
                if (check(item)) return errMsg //+ `: ${fieldToCheck}`
            }
        }

        for ( const fieldToCheck of fieldsToCheck ) {
            if (typeof fieldToCheck === 'string') {
                const item = document?.[fieldToCheck]
                // console.log({item, fieldToCheck, fieldIsNotDefined})
                switch (typeof item) {
                    // @ts-expect-error : fallthough case
                    case 'string': if (item.trim() && fieldIsNotDefined) return errMsg //+ `: ${fieldToCheck}`
                    default: if (item && fieldIsNotDefined) return errMsg //+ `: ${fieldToCheck}`
                }
            }
            else {
                const [fieldToCheckName, check] = fieldToCheck
                const item = document?.[fieldToCheckName]
                if (check(item)) return errMsg //+ `: ${fieldToCheck}`
            }
        }
        return true
    })
    return action === 'error' ? validation.error() : validation.warning()
}

export const dependantRequireGen = (label:string, fieldsToCheck:string[]|readonly string[], action:'error'|'warn'='error') => {
    
    return (Rule:Rule) => {
        const validation = Rule.custom((field, {document}) => {
            
            const errMsg = `Required as a field has been set in: ${label}`
            let fieldIsNotDefined:boolean

            switch (typeof field) {
                case 'string': fieldIsNotDefined = !field.trim(); break;
                case 'boolean': fieldIsNotDefined = false; break;
                case 'object': {
                    const fieldObj = field as Record<string,unknown>
                    if (fieldObj?._type && fieldObj._type === 'nextImage') fieldIsNotDefined = !fieldObj.asset
                    else if (fieldObj?._type && fieldObj._type === 'image') fieldIsNotDefined = !fieldObj.asset
                    else fieldIsNotDefined = !field
                    break;
                }
                default: fieldIsNotDefined = field === null ? false : !field
            }

            for ( const fieldToCheck of fieldsToCheck ) {
                const item = document?.[fieldToCheck]
                // console.log({item, fieldToCheck, fieldIsNotDefined})
                switch (typeof item) {
                    // @ts-expect-error : fallthough case
                    case 'string': if (item.trim() && fieldIsNotDefined) return errMsg //+ `: ${fieldToCheck}`
                    default: if (item && fieldIsNotDefined) return errMsg //+ `: ${fieldToCheck}`
                }
            }
            return true
        })
        return action === 'error' ? validation.error() : validation.warning()
    }
}