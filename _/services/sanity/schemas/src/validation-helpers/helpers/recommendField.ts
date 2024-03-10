import type { Rule } from "sanity"

const defaultMsg = 'Recommended to set this field.'

export const recommendField = (Rule:Rule, msg?:string):Rule => {

    return Rule.custom((field) => {

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
        return  fieldIsNotDefined ? (msg ?? defaultMsg) : true
    }).warning(msg ?? defaultMsg)
}