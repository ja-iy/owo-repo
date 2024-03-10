import { getTwThemeGlobalContainerGeneric, } from "./globalLookup"

import type { TwThemeGlobalContainer } from "./globalLookup"
import type { ExtarctColorStringBySubType, ResolvedColorConfig } from '../../config/create/utils'
import { setDarkmodeClass } from './set-darkmode-class'

const getStyle = () => globalThis?.document.documentElement.style

// reset the theme 
export function resetTheme(globalThemeContainer?: TwThemeGlobalContainer) {

    const style = getStyle(); if (!style) { return }
    const container = globalThemeContainer ?? getTwThemeGlobalContainerGeneric(); if (!container) return
    const colors = container.colors

    for (const id in colors) {
        style.removeProperty(colors[id]!.cssNameLight)
        style.removeProperty(colors[id]!.cssNameDark)
    }
}


// modifiy the theme
export function modThemeGeneric<
    TColors extends ResolvedColorConfig,
>(
    colorObj: ModColors<TColors>,
    reset = false
): void {

    const style = getStyle(); if (!style) { return }
    const container = getTwThemeGlobalContainerGeneric(); if (!container) return
    const colors = container.colors

    if (reset) {
        for (const id in colors) {
            if (colorObj[id]) {
                style.setProperty(colors[id]!.cssNameLight, colorObj[id]![0]!)
                style.setProperty(colors[id]!.cssNameDark, colorObj[id]![1]!)
            }
            else {
                style.removeProperty(colors[id]!.cssNameLight)
                style.removeProperty(colors[id]!.cssNameDark)
            }
        }
    }
    else {
        for (const id in colorObj) {
            if (colors[id]) {
                style.setProperty(colors[id]!.cssNameLight, colorObj[id]![0]!)
                style.setProperty(colors[id]!.cssNameDark, colorObj[id]![1]!)
            }
        }
    }
}



// modifiy the theme and reset whatever is not set
export function setThemeGeneric<
    TTheme extends ResolvedColorConfig,
>(
    colorObj: ModColors<TTheme>,
): void {

    return modThemeGeneric(colorObj, true)
}


// toggle dark mode - ( tw class name and switch variables)
export function toggleDarkMode(darkMode: boolean) {

    const style = getStyle(); if (!style) { return }
    const container = getTwThemeGlobalContainerGeneric(); if (!container) return
    // const colors = container.colors

    setDarkmodeClass(darkMode, container?.settings.DARKMODE_CSS_CLASSNAME || 'dark')

    // if (darkMode) {
    //     for (const id in colors) {
    //         style.setProperty(colors[id]!.cssName, colors[id]!.cssNameVarDark)
    //     }
    // }
    // else {
    //     for (const id in colors) {
    //         style.setProperty(colors[id]!.cssName, colors[id]!.cssNameVarLight)
    //     }
    // }
}

// input color object
export type ModColors<T extends ResolvedColorConfig = ResolvedColorConfig> = {
    [K in keyof T]?: ModColorItem<ExtarctColorStringBySubType[T[K]['subType']]>
}
export type ModColorItem<T extends string> = [light?: T | null, dark?: T | null]
