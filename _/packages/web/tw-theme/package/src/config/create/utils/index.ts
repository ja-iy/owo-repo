import type { Reformat } from "@repo/ts-utils/types"
import { resolveColorItem, type ColorItem, type UnresolvedColorItemInput, hslColorValue, resolveColorConfig, type ResolvedColorConfig } from "./primitives/color"
import type { FontItem, ResolvedFontConfig } from "./primitives/font"

import type { PackageThemeConfig } from "../config-generators/package-theme-builder"
import type { AppThemeConfig } from "../config-generators/app-theme-builder"

export * from "./primitives/color"
export * from "./primitives/font"
export * from "./primitives/name-resolvers"
export * from "./primitives/variant"
export * from "./primitives/settings"
export * from "./primitives/generated"

export * from "../config-generators/package-theme-builder"
export * from "../config-generators/app-theme-builder"


export type ThemeDiscriminator = 'tw-theme-package' | 'tw-theme-app'

export type GenTheme = {
    __DU: ThemeDiscriminator,
    packageJsonName?: string | null,
    colors: ResolvedColorConfig
    fonts: ResolvedFontConfig
}

export function createGenTheme<
    Theme extends PackageThemeConfig | AppThemeConfig,
    TRes extends GenTheme = GenTheme
>(theme: Theme): TRes {
    return {
        __DU: theme.__DU,
        packageJsonName: 'packageJsonName' in theme ? theme.packageJsonName : null,
        colors: theme.colors,
        fonts: theme.fonts,
    } as TRes
}

export function isThemeConfig(themeConfig: unknown): themeConfig is PackageThemeConfig | AppThemeConfig {
    return (
        typeof themeConfig === 'object' &&
        themeConfig !== null &&
        '__DU' in themeConfig &&
        typeof themeConfig['__DU'] === 'string' &&
        themeConfig['__DU'].startsWith('tw-theme')
    )
}

//tests

// const reeiugi = [
//     'ubu',
//     hslColorValue(0, 0, 0),
//     'ree'
// ] as const satisfies Parameters<typeof resolveColorItem>

// const ree2 = [
//     'ubus',
//     [hslColorValue(0, 0, 0), hslColorValue(0, 0, 0)],
//     'rees'
// ] as const satisfies Parameters<typeof resolveColorItem>

// const col1 = resolveColorItem(...reeiugi)
// const col2 = resolveColorItem(...ree2)

// // const rees = [reeiugi, ree2] as const satisfies UnresolvedColorItemInput[]
// const cols = [col1, col2] as const satisfies ColorItem[]

// type Cols = typeof cols
// // type Rees = typeof rees

// type reeee = Reformat<typeof col1>

// const uuuu = resolveColorConfig({
//     ubu: [hslColorValue(0, 0, 0), 'ree'],
//     ubus: [[hslColorValue(0, 0, 0), hslColorValue(0, 0, 0)], 'rees'],
// })

// // type TupleToRecord<T extends readonly [string, any][]> = {
// //     [K in T[number][0]]: T extends Extract<T[number], [K, any]>
// //         ? Extract<T[number], [K, any]>[1]
// //         : never;
// //   };

// //   // Example usage
// //   type MyTuple = [
// //     ['key1', number],
// //     ['key2', string],
// //     ['key3', boolean]
// //   ] 
// //   type MyRecord = TupleToRecord<MyTuple>;

// type ColorItemArrayToRecord<T extends ColorItem[]> = {
//     [K in T[number]['twName']]: Reformat<Extract<T[number], { twName: K }>>
// }





// // type UBUBIn = ResolveColors<Rees>
// type UBUB = ColorItemArrayToRecord<Cols>

// // type ree = UBUBIn['ubu']['subType']

// type TupleToRecord<T extends readonly [string, string][]> = {
//     [K in T[number][0]]: Extract<T[number], [K, any]>[1]
// }

// // Example usage
// type MyTuple = [['a', 'b'], ['c', 'd']];
// type MyRecord = TupleToRecord<MyTuple>;


// // type FirstKeyInTupleToRecord<T extends readonly [string, ...unknown[]][]> = {
// //     [K in T[number][0]]: Extract<T[number], [K, ...unknown[]]>
// // }