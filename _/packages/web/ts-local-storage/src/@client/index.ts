"use client"

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { extractUpdate } from '@repo/jotai-utils/@client'
import type { ReadWriteAtom } from '@repo/jotai-utils/@client'
import type { z } from 'zod'



export const createLocalStorage = <
    TSchema extends z.ZodType,
    TInitial extends TValue | (() => TValue),
    TValue = z.infer<TSchema>,
    TId extends string = string
>(config: {
    id: TId,
    initialValue: TInitial,
    schema: TSchema,
    ignoreHydrationMismatch?: boolean
    eventOnSameTab?: boolean
    onValueChange?: (value: TValue) => void
    onInit?: (value: TValue) => void
}) => {

    const {
        id,
        schema,
        initialValue: initalValueResolver,
        ignoreHydrationMismatch = false,
        eventOnSameTab = true
    } = config

    const initialValue = (typeof initalValueResolver === 'function'? initalValueResolver() : initalValueResolver) as TValue

    const currentValue = ignoreHydrationMismatch
        ? getLocalStorage(id, initialValue, schema)
        : initialValue

    config.onInit?.(currentValue)

    const storageAtom = ignoreHydrationMismatch
        ? atom(currentValue)       // can cause Hydration error [ when initialValue & localStorage values are diffrent ]
        : atom<TValue>(currentValue)                            // can cause inital desync between localStorage & app [ when initialValue & localStorage values are diffrent ]

    const localStorageAtom: ReadWriteAtom<TValue> = atom(
        (get) => get(storageAtom),
        (get, set, update) => {


            const currentValue = get(storageAtom)
            const newValue = setLocalStorage(id, currentValue, extractUpdate(currentValue, update))

            // console.log('local-storage-atom update :', { id, currentValue, newValue })


            if (eventOnSameTab) {
                //  ensures that the storage event is fired on the current window
                globalThis?.window.dispatchEvent(new StorageEvent('storage', {
                    key: id,
                    newValue: JSON.stringify(newValue),
                    oldValue: JSON.stringify(currentValue),
                    storageArea: localStorage,
                }))
            }


            if (newValue !== currentValue) { 
                set(storageAtom, newValue) 
                config.onValueChange?.(newValue)
            }

            return newValue
        }
    )

    if (!config.ignoreHydrationMismatch) {
        localStorageAtom.onMount = (set) => { set(getLocalStorage(id, initialValue, schema)) }
    }


    return {
        ...config,
        atom: localStorageAtom,
        useState: () => useAtom(localStorageAtom),
        useValue: () => useAtomValue(localStorageAtom),
        useSetValue: () => useSetAtom(localStorageAtom),
        _Types: {
            value: undefined as unknown as TValue,
        }
    }
}

export type LocalStorageItem = ReturnType<typeof createLocalStorage>


// UTILS //

export const getLocalStorage = <
    TSchema extends z.ZodType,
    TInitial extends TValue,
    TValue = z.infer<TSchema>
>(
    id: string,
    initialValue: TInitial,
    schema: TSchema
): TValue => {

    const localStorage = globalThis?.window?.localStorage
    if (!localStorage) return initialValue

    try {
        const item = localStorage.getItem(id)
        if (item) return schema.parse(JSON.parse(item))
        setLocalStorage(id, initialValue, initialValue)
        return initialValue

    }
    catch (error) {
        console.error('Error retrieving data from local storage:', id, '\n', error)
        return initialValue
    }
}

export const setLocalStorage = <
    TValue
>(
    id: string,
    currentValue: TValue,
    newValue: TValue,
): TValue => {

    const localStorage = globalThis?.window?.localStorage
    if (!localStorage) return currentValue

    try {
        localStorage.setItem(id, JSON.stringify(newValue))
        return newValue
    }
    catch (error) {
        console.error('Error setting data in local storage:', '\n', error)
        return currentValue
    }
}


export const createLocalSubStorage = <
    TSubIds extends string[] | readonly string[],
    TSchema extends z.ZodType,
    TInitial extends TValue,
    TValue = z.infer<TSchema>
>(config: {
    id: string,
    subIds: TSubIds,
    initialValue: TInitial,
    schema: TSchema,
    ignoreHydrationMismatch?: boolean
}) => {

    type SubStorageItem = ReturnType<typeof createLocalStorage<TSchema, TInitial, TValue>>

    const subStorage = {} as Record<string, unknown>

    for (const subId of config.subIds) {
        subStorage[subId] = createLocalStorage({
            ...config,
            id: config.id + '-' + subId,
        })
    }

    subStorage['_Types'] = { value: undefined as unknown as TValue }
    subStorage['schema'] = config.schema

    return subStorage as {
        [K in TSubIds[number]]: SubStorageItem
    } & {
        _Types: { value: TValue },
        schema: TSchema,
    }
}