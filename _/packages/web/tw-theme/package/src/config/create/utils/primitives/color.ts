import type { Reformat } from "@repo/ts-utils/types"
import { resolveToCssVar, resolveToCssVarDark, resolveToCssVarLight, resolveToCssVarNameDark, resolveToCssVarNameLight } from "./name-resolvers"
import type { ResolveCssName } from "./name-resolvers"
import type { PackageThemeConfig } from "../../config-generators/package-theme-builder"
import type { ThemePackageInputItem } from "../../config-generators/app-theme-builder"


export type HslInputValue = [h: number, s: number, l: number]
export type HslStringValue = `${ number }deg ${ number }% ${ number }%`
export type HslColorValue = { colorType: 'hsl', value: HslStringValue }
export const hslStringValue = (h: number, s: number, l: number): HslColorValue["value"] => `${ h }deg ${ s }% ${ l }%`
export const hslColorValue = (h: number, s: number, l: number): HslColorValue => ({ colorType: 'hsl', value: hslStringValue(h, s, l) })
export type HslResolver = typeof hslColorValue
export type HslValueResolver = typeof hslStringValue

export type RgbInputValue = [r: number, g: number, b: number]
export type RgbStringValue = `${ number } ${ number } ${ number }`
export type RgbColorValue = { colorType: 'rgb', value: RgbStringValue }
export const rgbStringValue = (r: number, g: number, b: number): RgbColorValue["value"] => `${ r } ${ g } ${ b }`
export const rgbColorValue = (r: number, g: number, b: number): RgbColorValue => ({ colorType: 'rgb', value: rgbStringValue(r, g, b) })
export type RgbResolver = typeof rgbColorValue
export type RgbValueResolver = typeof rgbStringValue

export type HexInputValue = `#${ string }`
export type HexStringValue = HexInputValue
export type HexColorValue = { colorType: 'hex', value: HexStringValue }
export const hexStringValue = (hex: HexInputValue): HexColorValue["value"] => hex
export const hexColorValue = (hex: HexInputValue): HexColorValue => ({ colorType: 'hex', value: hexStringValue(hex) })
export type HexResolver = typeof hexColorValue
export type HexValueResolver = typeof hexStringValue


export type ExtarctColorStringBySubType<TColorItem extends ColorItem = ColorItem> = {
    [K in TColorItem['subType']]: K extends 'hsl' ? HslStringValue : K extends 'rgb' ? RgbStringValue : K extends 'hex' ? HexStringValue : never
}

export type Color = HslColorValue | RgbColorValue | HexColorValue
export type ColorStringValue = Color['value']

export type ColorItem<
    TTwName extends string = string,
    TValue extends ColorInputValue = ColorInputValue,
    TCssName extends string | undefined = string | undefined,
    TCssNameResolved extends ResolveCssName<TTwName, TCssName> = ResolveCssName<TTwName, TCssName>,    
    TColor extends ExtractColorValue<TValue> = ExtractColorValue<TValue>
> = {
    type: 'color',
    subType: TColor['valueLight']['colorType'] & TColor['valueDark']['colorType'],
    twName: TTwName,
    valueLight: TColor['valueLight']['value'],
    valueDark: TColor['valueDark']['value'],
    cssName: `-${ TCssNameResolved }`,
    cssNameLight: `--lm${ TCssNameResolved }`,
    cssNameDark: `--dm${ TCssNameResolved }`,
    cssNameVarLight: `var(--lm${ TCssNameResolved })`,
    cssNameVarDark: `var(--dm${ TCssNameResolved })`,
}



export type ResolveColors<
    T extends UnresolvedColorConfig = UnresolvedColorConfig,
> = {
        [K in keyof T]: K extends string ? Reformat<ColorItem<K, T[K][0], T[K][1]>> : never
    }

export const resolveColorValue = {
    hsl: hslColorValue,
    rgb: rgbColorValue,
    hex: hexColorValue,
} as const
export type ResolveColorValue = typeof resolveColorValue

export const resolveColorStringValue = {
    hsl: hslStringValue,
    rgb: rgbStringValue,
    hex: hexStringValue,
} as const
export type ResolveColorStringValue = typeof resolveColorStringValue

export type ColorInputTuple =
    | [light: HslColorValue, dark: HslColorValue]
    | [light: RgbColorValue, dark: RgbColorValue]
    | [light: HexColorValue, dark: HexColorValue]

export function extractColorString<
    const TValue extends ColorInputValue
>(
    value: TValue
): ExtractColorValue<TValue> {
    if (Array.isArray(value)) {
        const [light, dark] = value
        return {
            valueLight: light as ExtractColorValueLight<TValue>,
            valueDark: dark as ExtractColorValueDark<TValue>,
        }
    }

    return {
        valueLight: value as ExtractColorValueLight<TValue>,
        valueDark: value as ExtractColorValueDark<TValue>,
    }

}

export type ColorInputValue = Color | ColorInputTuple

export type ExtractColorValueLight<T extends ColorInputValue> = T extends Color ? T : T extends [Color, Color] ? T[0] : never
export type ExtractColorValueDark<T extends ColorInputValue> = T extends Color ? T : T extends [Color, Color] ? T[0] : never

export type ExtractColorValue<T extends ColorInputValue> = {
    valueLight: ExtractColorValueLight<T>
    valueDark: ExtractColorValueDark<T>
}


export type UnresolvedColorItemInput<
    TValue extends ColorInputValue = ColorInputValue,
    TCssName extends string | undefined = string | undefined,
> = [colorInput: TValue, cssName?: TCssName]

export type UnresolvedColorConfig<TKeys extends string = string> = Record<TKeys, UnresolvedColorItemInput>
export type ResolvedColorConfig<TKeys extends string = string> = Record<TKeys, ColorItem>



export function resolveColorItem<
    const TTwName extends string,
    const TValue extends ColorInputValue,
    const TCssName extends string = TTwName
>(
    twName: TTwName,
    value: TValue,
    cssName?: TCssName
) {

    const color = extractColorString(value)

    return {
        type: 'color',
        subType: color.valueLight.colorType,
        twName,
        valueLight: color.valueLight.value,
        valueDark: color.valueDark.value,
        cssName: resolveToCssVar(cssName ?? twName),
        cssNameDark: resolveToCssVarDark(cssName ?? twName),
        cssNameLight: resolveToCssVarLight(cssName ?? twName),
        cssNameVarDark: resolveToCssVarNameDark(cssName ?? twName),
        cssNameVarLight: resolveToCssVarNameLight(cssName ?? twName),
    } satisfies ColorItem as ColorItem<TTwName, TValue, TCssName>
}


export function resolveColorConfig<
    const TUnresolvedConfig extends UnresolvedColorConfig
>(config: TUnresolvedConfig): Reformat<ResolveColors<TUnresolvedConfig>> {

    const colors = {} as Record<string, ColorItem>

    for (const twName in config) {
        const [value, cssName] = config[twName]!
        colors[twName] = resolveColorItem(twName, value, cssName)
    }

    return colors as Reformat<ResolveColors<TUnresolvedConfig>>
}


export const ensureNoColorConflicts = (colors:ResolvedColorConfig,  colorName:string, colorConfig:ColorItem , theme:ThemePackageInputItem, themes:ThemePackageInputItem[]) => {
    
    const definedColor = colors[colorName]

    if (!definedColor) { return }
    if (definedColor.subType === colorConfig.subType) { return }

    for (const originalColorTheme of themes) {
        const originalColor = originalColorTheme.config.colors[colorName]
        if (!originalColor) { continue }
        if (originalColor.subType === colorConfig.subType) { continue }
        throw new Error(`Two themes cannot be implemented when specifying diffrent color types for the same key, 
            - COLOR KEY: ${colorName},
            - ${originalColorTheme.config.packageJsonName} specifies color type: ${originalColor.subType}
            - ${theme.config.packageJsonName} specifies color type: ${colorConfig.subType}
        `)
    }

    throw new Error(`Two themes cannot be implemented when specifying diffrent color types for the same key,
        - COLOR KEY: ${colorName}, 
        - prior theme package specifies color type: ${definedColor.subType}
        - ${theme.config.packageJsonName} specifies color type: ${colorConfig.subType}
    `)
}
