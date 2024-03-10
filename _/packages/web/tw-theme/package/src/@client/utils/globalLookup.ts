import { TW_THEME_GLOBAL_CONTAINER_KEY } from "../../vars"
import type { ResolvedColorConfig } from "../../config/create/utils/primitives/color"
import type { ResolvedFontConfig } from "../../config/create/utils/primitives/font"
import type { AppThemeSettings } from "../../config/create/utils/primitives/settings"
import type { GeneratedThemeVarNames, GeneratedThemeVarsDark, GeneratedThemeVarsLight } from "../../config/create/utils/primitives/generated"

export type TwThemeGlobalContainer<
    TColors extends ResolvedColorConfig = ResolvedColorConfig,
    TFonts extends ResolvedFontConfig = ResolvedFontConfig,
    TSettings extends AppThemeSettings = AppThemeSettings,
    TVarNames extends GeneratedThemeVarNames = GeneratedThemeVarNames,
> = {
    colors: TColors,
    fonts: TFonts,
    settings: TSettings,
    varNames: TVarNames,
}

export function getTwThemeGlobalContainerGeneric<TContainer extends TwThemeGlobalContainer = TwThemeGlobalContainer>():TContainer{

    const global = globalThis as Record<string, unknown>

    if (!global[TW_THEME_GLOBAL_CONTAINER_KEY]) {
        global[TW_THEME_GLOBAL_CONTAINER_KEY] = {
            colors: {},
            fonts: {},
            settings: {},
            varNames: []
        } as unknown as TContainer
        return global[TW_THEME_GLOBAL_CONTAINER_KEY] as TContainer
    }

    return global[TW_THEME_GLOBAL_CONTAINER_KEY] as TContainer
}


export function initTwThemeGlobalContainerGeneric<
    const TColors extends ResolvedColorConfig,
    const TFonts extends ResolvedFontConfig,
    const TSettings extends AppThemeSettings,
    const TVarNames extends GeneratedThemeVarNames,
>(
    colors:TColors,
    fonts:TFonts,
    settings:TSettings,
    varNames:TVarNames,
){

    const container = getTwThemeGlobalContainerGeneric<TwThemeGlobalContainer<TColors, TFonts, TSettings, TVarNames>>()

    container.colors = colors
    container.fonts = fonts
    container.settings = settings
    container.varNames = varNames

    // console.log('INIT CONTAINER', container)
}
