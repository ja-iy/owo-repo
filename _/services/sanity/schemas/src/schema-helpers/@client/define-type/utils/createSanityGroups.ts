import type { FieldGroupDefinition } from 'sanity'

export function createSanityGroups<
    TArr extends readonly FieldGroupDefinition[],
>(
    groupArray:TArr
){  
    const groupNames = Object.fromEntries(groupArray.map((item) => [item.name, item.name])) as Record<TArr[number]['name'], TArr[number]['name']>

    return { 
        groupArray: groupArray as unknown as FieldGroupDefinition[],
        names: groupNames,
    }
}