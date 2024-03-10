import { getTwThemeGlobalContainerGeneric, initTwThemeGlobalContainerGeneric } from "../utils/globalLookup"
import { useEffect } from "react"
import { toggleDarkMode } from "../utils/edit-theme"
import { useDarkModeValue } from "./dark-mode"


import type { TwThemeGlobalContainer } from "../utils/globalLookup"

import type { ResolvedColorConfig } from "../../config/create/utils/primitives/color"
import type { ResolvedFontConfig } from "../../config/create/utils/primitives/font"
import type { AppThemeSettings } from "../../config/create/utils/primitives/settings"
import type { GeneratedThemeVarNames, GeneratedThemeVarsDark, GeneratedThemeVarsLight } from "../../config/create/utils/primitives/generated"

export function useInit__twThemeGeneric<
    const TColors extends ResolvedColorConfig,
    const TFonts extends ResolvedFontConfig,
    const TSettings extends AppThemeSettings,
    const TVarNames extends GeneratedThemeVarNames,
>(input:{
    colors:TColors,
    fonts:TFonts,
    settings:TSettings,
    varNames:TVarNames,
}){


    useEffect(() => {
        initTwThemeGlobalContainerGeneric(input.colors, input.fonts, input.settings, input.varNames)
    }, [input])

    const darkMode = useDarkModeValue()

    useEffect(() => {
        toggleDarkMode(darkMode)
    }, [input, darkMode])
}

export function useTwThemeContainerGeneric<
    TContainer extends TwThemeGlobalContainer = TwThemeGlobalContainer
>(){
    return getTwThemeGlobalContainerGeneric<TContainer>()
}
