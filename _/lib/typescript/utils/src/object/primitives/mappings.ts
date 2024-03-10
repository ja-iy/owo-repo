import type { Entries } from "type-fest"


export function objectKeys<TObj extends Record<PropertyKey, unknown>>(obj:TObj) {
    return Object.keys(obj) as Array<keyof TObj>
}



export function objectEntries<TObj extends Record<PropertyKey, unknown>>(obj:TObj) {
    return Object.entries(obj) as Entries<TObj>
}


export function narrowObject<
    TObj extends Record<string, unknown>,
    TSelect extends Array<keyof TObj>,
>(
    obj: TObj,
    select: TSelect,
){

    type Selected = TSelect extends infer R 
        ? R extends Array<infer Item> ? Item : never
        : never

    const selectSet = new Set(select)

    for (const prop in obj) { if (!selectSet.has(prop)) { delete obj[prop] } } // Remove the specified properties

    return obj as Reformat<Pick<TObj, Selected>>
}

type SelectFromObject<
    TObj extends Record<string, unknown>,
    TSelect extends Array<keyof TObj>,
> = Pick<TObj, TSelect[number]>

export function removeFromObject<
    TObj extends Record<string, unknown>,
    TRemove extends Array<keyof TObj>,
>(
    obj: TObj,
    remove: TRemove,
){

    type Removed = TRemove extends infer R 
        ? R extends Array<infer Item> ? Item : never
        : never

    for (const prop of remove) { delete obj[prop] } // Remove the specified properties

    return obj as Reformat<Omit<TObj, Removed>>
}

type RemoveFromObject<
    TObj extends Record<string, unknown>,
    TRemove extends Array<keyof TObj>,
> = Omit<TObj, TRemove[number]>

