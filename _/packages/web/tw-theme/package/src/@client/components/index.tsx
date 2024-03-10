import { useResetTheme, useModThemeGeneric, useSetThemeGeneric } from '../hooks'

import type { ModColors } from '../'
import type { TwThemeGlobalContainer } from "../utils/globalLookup";
import type { ResolvedColorConfig } from '../../config/create/utils/primitives/color';



// reset the theme 
export function ResetTheme(props: {
    container?: TwThemeGlobalContainer
}): React.ReactNode {

    useResetTheme(props.container)
    return null
}



// modifiy the theme
export function ModThemeGeneric<
    TTheme extends ResolvedColorConfig,
>(props: {
    modConfig: ModColors<TTheme>,
    reset?: false
}): React.ReactNode {

    useModThemeGeneric<TTheme>(props.modConfig, props.reset)
    return null
}


// modifiy the theme and reset whatever is not set
export function SetThemeGeneric<
    TTheme extends ResolvedColorConfig,
>(props: {
    colors?: ModColors<TTheme>,
}): React.ReactNode {

    useSetThemeGeneric<TTheme>(props.colors)
    return null
}

