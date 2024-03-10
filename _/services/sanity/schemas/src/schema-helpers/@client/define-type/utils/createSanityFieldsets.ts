import type { FieldsetDefinition } from 'sanity'

export function createSanityFieldsets<
    TArr extends readonly FieldsetDefinition[],
>(
    fieldsetArray:TArr
){  
    const fieldsetNames = Object.fromEntries(fieldsetArray.map((item) => [item.name, item.name])) as Record<TArr[number]['name'], TArr[number]['name']>

    return { 
        fieldsetArray: fieldsetArray as unknown as FieldsetDefinition[],
        names: fieldsetNames,
    }
}