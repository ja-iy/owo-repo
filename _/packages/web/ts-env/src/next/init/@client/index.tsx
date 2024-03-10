"use client"

import type { DynamicTsEnv, CustomLookup, CustomLookupContainer } from "../../../next"
import { useState } from "react"


type SetPublicEnvsInBrowserProps = {
    LOOKUP_KEY: typeof DynamicTsEnv['LOOKUP_KEY']
    SHAREABLE_LOOKUP: CustomLookup
    children?: React.ReactNode
}

export function SetShareableEnvsInBrowser(props: SetPublicEnvsInBrowserProps) {

    useSetShareableEnvsInBrowser(props)

    return props.children ?? null
}

export function useSetShareableEnvsInBrowser(props: SetPublicEnvsInBrowserProps) {

    const [ initialized, setInitialized ] = useState(false)

    if (!initialized) {
        setShareableEnvsInBrowser(props)
        setInitialized(true)
    }
}



export function setShareableEnvsInBrowser(props: SetPublicEnvsInBrowserProps){

    const globalRawLookupContainer = globalThis.window as unknown as CustomLookupContainer | undefined

    if (!globalRawLookupContainer)  { return null }


    const globalRawLookup = globalRawLookupContainer[props.LOOKUP_KEY]


    if (!globalRawLookup) { globalRawLookupContainer[props.LOOKUP_KEY] = props.SHAREABLE_LOOKUP }
    else {

        for (const key in props.SHAREABLE_LOOKUP.client) {
            globalRawLookup['client'][key] = props.SHAREABLE_LOOKUP.client[key]
        }

        for (const key in props.SHAREABLE_LOOKUP.shared) {
            globalRawLookup['shared'][key] = props.SHAREABLE_LOOKUP.shared[key]
        }
    }

    return null

}