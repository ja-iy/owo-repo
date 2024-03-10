import type { TW_THEME_PACKAGE_NAME_PREFIX } from "../../../vars"

import { ensureNoColorConflicts, resolveColorConfig, resolveColorValue } from "../utils/primitives/color"
import type { Color, ColorItem, ResolveColorStringValue, ResolveColorValue, ResolveColors, ResolvedColorConfig, UnresolvedColorConfig, UnresolvedColorItemInput } from "../utils/primitives/color"

import { resolveFontConfig } from "../utils/primitives/font"
import type { ResolvedFontConfig, UnresolvedFontConfig } from "../utils/primitives/font"
import type { AppThemeSettings } from "../utils/primitives/settings"
 
import { createThemeVariantModifier } from "../utils/primitives/variant"
import type { ModColors, VariantConfig, VariantModifier, VariantModifierItem } from "../utils/primitives/variant"

import type { Overwrite, MergeObjectArray, MapArray, Reformat } from "@repo/ts-utils/types"

import type { PackageThemeConfig } from "./package-theme-builder"


type ExtractForbiddenKeys<TStore extends Store> = Extract<
    | keyof TStore['colors']
    | keyof TStore['fonts']
    , string>


type Store<
    TAppThemeSettings extends AppThemeSettings = AppThemeSettings,
    TColorConfig extends ResolvedColorConfig = ResolvedColorConfig,
    TFontConfig extends ResolvedFontConfig = ResolvedFontConfig,
> = {
    __DU: 'tw-theme-app',
    settings: TAppThemeSettings,
    colors: TColorConfig
    fonts: TFontConfig,
    themePackageNames?: string[],
    // debug?: any,
}

export type AppThemeConfig = Store

type Chainable = Partial<Record<ChainableItem, unknown>>
type ChainableItem =
    | 'implement'
    | 'override'
    | 'colors'
    | 'fonts'
    | 'build'


export function buildAppTheme<
    TAppThemeSettings extends AppThemeSettings = AppThemeSettings,
>(
    settings: TAppThemeSettings,
) {

    const initialStore = {
        __DU: 'tw-theme-app',
        settings,
        colors: {} as ResolvedColorConfig<never>,
        fonts: {} as ResolvedFontConfig<never>,
    } satisfies Store

    return {
        implement: implement_theme(initialStore),
        colors: set_colors(initialStore),
        fonts: set_fonts(initialStore),
    } satisfies Chainable
}




export type ThemePackageInputItem<
    TPackageTheme extends PackageThemeConfig = PackageThemeConfig,
    TVariantName extends keyof TPackageTheme['variants'] extends infer R ? R extends string ? R : never : never = keyof TPackageTheme['variants'] extends infer R ? R extends string ? R : never : never
> = {
    config: TPackageTheme,
    variantName?: TVariantName,
    variant?: VariantModifierItem<any, TPackageTheme['packageJsonName']> 
}

const implementInputResolver = <const T extends PackageThemeConfig>(config:T, variantName?:keyof T['variants']) => ({config, variantName})



function implement_theme<TStore extends Store>(store: TStore) {

    return <
        const TPackageThemes extends ThemePackageInputItem[] = ThemePackageInputItem[],
    >(
        input:  (theme: typeof implementInputResolver) => TPackageThemes ,
    ) => {

        const colors = store.colors 
        const fonts = store.fonts

        const themes = input(implementInputResolver)

        const themePackageNames = themes.map(t => t.config.packageJsonName)
        if (themePackageNames.length) store.themePackageNames = themePackageNames


        for (const theme of themes) {
            for (const [colorName, colorConfig] of Object.entries(theme.config.colors)) {
                ensureNoColorConflicts(colors, colorName, colorConfig, theme, themes) //POSSIBLE-IMPROVEMENT: move this to a type level check as a restriction on TPackageThemes ( drawback: ts server performance )
                colors[colorName] = colorConfig
            }
            for (const [fontName, fontConfig] of Object.entries(theme.config.fonts)) {
                fonts[fontName] = fontConfig
            }
            if (theme.variantName) { theme.config.variants[theme.variantName]!.colors(colors) }
        }


        // @ts-expect-error "colors: Overwrite"
        type AddColors = MergeObjectArray<MapArray<MapArray<TPackageThemes, 'config'>, 'colors'>>
        // @ts-expect-error "fonts: Overwrite"
        type AddFonts = MergeObjectArray<MapArray<MapArray<TPackageThemes, 'config'>, 'fonts'>>

        const updatedStore = store as unknown as Overwrite<TStore, {
            colors: Overwrite<TStore['colors'], AddColors>
            fonts: Overwrite<TStore['fonts'], AddFonts>
        }>

        return {
            override: perform_override(updatedStore),
            colors: set_colors(updatedStore),
            fonts: set_fonts(updatedStore),
            build: build(updatedStore),
        } satisfies Chainable
    }
}


function set_colors<TStore extends Store>(store: TStore) {

    return < 
        TForbiddenKeys extends ExtractForbiddenKeys<TStore> = ExtractForbiddenKeys<TStore>,
        TUnresolvedColorConfig extends UnresolvedColorConfig = UnresolvedColorConfig,
    >(
        // unresolvedColorsCreator: (col: ResolveColorValue) => TUnresolvedColorConfig & Partial<Record<TForbiddenKeys, never>>
        unresolvedColorsCreator: (col: ResolveColorValue) => TUnresolvedColorConfig & Partial<Record<TForbiddenKeys, `to set this key use .override(...) after .implements(...)`|never>>
    ) => {

        const additionalColors = resolveColorConfig(unresolvedColorsCreator(resolveColorValue)) as unknown as ResolveColors<TUnresolvedColorConfig>

        const colors = {
            ...additionalColors,
            ...store.colors,
        }

        const updatedStore = {
            ...store,
            colors,
        }

        return {
            fonts: set_fonts(updatedStore),
            build: build(updatedStore),
        } satisfies Chainable
    }
}


function set_fonts<TStore extends Store>(store: TStore) {

    return <
        TForbiddenKeys extends ExtractForbiddenKeys<TStore> = ExtractForbiddenKeys<TStore>,
        TUnresolvedFontConfig extends UnresolvedFontConfig = UnresolvedFontConfig,
    >(
        fonts: TUnresolvedFontConfig
    ) => {

        const updatedStore = {
            ...store,
            fonts: {
                ...store.fonts,
                ...resolveFontConfig(fonts)
            }
        }

        return {
            build: build(updatedStore),
        } satisfies Chainable
    }
}



function perform_override<TStore extends Store>(store: TStore) {

    return (
        colorMods: (col: ResolveColorStringValue) => ModColors<TStore['colors']>
    ) => {

        const performOverride = createThemeVariantModifier(colorMods, '@repo-theme/app')


        const updatedStore = {
            ...store,
            colors: performOverride.colors(store.colors)
        }

        return {
            colors: set_colors(updatedStore),
            fonts: set_fonts(updatedStore),
            build: build(updatedStore),
        } satisfies Chainable
    }
}


function build<TStore extends Store>(store: TStore) {

    return () => {
        return store
    }
}

