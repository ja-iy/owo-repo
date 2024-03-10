import { useEffect } from 'react'

import { resetTheme, modThemeGeneric, setThemeGeneric } from '../'

import type { ModColors } from '../'
import type { ResolvedColorConfig } from '../../config/create/utils'
import type { TwThemeGlobalContainer } from "../utils/globalLookup"


export * from "./dark-mode"
export * from "./init"



// reset the theme 
export function useResetTheme(container?: TwThemeGlobalContainer) {

    useEffect(() => {
        if (!container) return
        resetTheme(container)
    }, [container])
}



// modifiy the theme
export function useModThemeGeneric<
    TTheme extends ResolvedColorConfig,
>(
    colorObj: ModColors<TTheme>,
    reset = false
): void {

    useEffect(() => {
        if (!colorObj) return
        modThemeGeneric<TTheme>(colorObj, reset)
    }, [colorObj, reset])
}



// modifiy the theme and reset whatever is not set
export function useSetThemeGeneric<
    TTheme extends ResolvedColorConfig,
>(
    colors?: ModColors<TTheme>,
): void {

    useEffect(() => {
        if (!colors) { resetTheme(); return }
        setThemeGeneric<TTheme>(colors)
    }, [colors])
}


