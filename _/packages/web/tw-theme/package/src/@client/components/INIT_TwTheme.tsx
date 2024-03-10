import { useInit__twThemeGeneric } from ".."
import type { ResolvedColorConfig } from "../../config/create/utils/primitives/color"
import type { ResolvedFontConfig } from "../../config/create/utils/primitives/font"
import type { AppThemeSettings } from "../../config/create/utils/primitives/settings"
import type { GeneratedThemeVarNames, GeneratedThemeVarsDark, GeneratedThemeVarsLight } from "../../config/create/utils/primitives/generated"

export function INIT_twThemeGeneric<
    const TColors extends ResolvedColorConfig,
    const TFonts extends ResolvedFontConfig,
    const TSettings extends AppThemeSettings,
    const TVarNames extends GeneratedThemeVarNames,
>(props: {
    colors: TColors,
    fonts: TFonts,
    settings: TSettings,
    varNames: TVarNames,
}): React.ReactNode {

    useInit__twThemeGeneric<TColors, TFonts, TSettings, TVarNames>(props)
    return null
}


