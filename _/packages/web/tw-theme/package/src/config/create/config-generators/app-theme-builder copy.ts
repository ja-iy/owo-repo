// import type { TW_THEME_PACKAGE_NAME_PREFIX } from "../../../vars"

// import { resolveColorConfig, resolveColorValue } from "../utils/primitives/color"
// import type { ResolveColorStringValue, ResolveColorValue, ResolveColors, ResolvedColorConfig, UnresolvedColorConfig, UnresolvedColorItemInput } from "../utils/primitives/color"

// import { resolveFontConfig } from "../utils/primitives/font"
// import type { ResolvedFontConfig, UnresolvedFontConfig } from "../utils/primitives/font"
// import type { AppThemeSettings } from "../utils/primitives/settings"

// import { createThemeVariantModifier } from "../utils/primitives/variant"
// import type { ModColors, VariantConfig, VariantModifier } from "../utils/primitives/variant"

// import type { Overwrite, Reformat } from "@repo/ts-utils/types"

// import type { PackageThemeConfig } from "./package-theme-builder"


// type ExtractForbiddenKeys<TStore extends Store> = Extract<
//     | keyof TStore['colors']  
//     | keyof TStore['fonts'] 
// ,string>


// type Store<
//     TAppThemeSettings extends AppThemeSettings = AppThemeSettings,
//     TColorConfig extends ResolvedColorConfig = ResolvedColorConfig,
//     TFontConfig extends ResolvedFontConfig = ResolvedFontConfig,
// > = {
//     __DU: 'tw-theme-app',
//     settings: TAppThemeSettings,
//     colors: TColorConfig
//     fonts: TFontConfig
// }

// export type AppThemeConfig = Store

// type Chainable = Partial<Record<ChainableItem, unknown>>
// type ChainableItem =
//     | 'implement'
//     | 'override'
//     | 'colors'
//     | 'fonts'
//     | 'build'

// type InitialStore<TSetttings extends AppThemeSettings> = {
//     __DU: 'tw-theme-app',
//     settings: TSetttings,
//     colors: ResolvedColorConfig<never>,
//     fonts: ResolvedFontConfig<never>,
// }


// export function buildAppTheme<
//     TAppThemeSettings extends AppThemeSettings = AppThemeSettings,
// >(
//     settings: TAppThemeSettings,
// )  {

//     const initialStore = {
//         __DU: 'tw-theme-app',
//         settings,
//         colors: {} as ResolvedColorConfig<never>,
//         fonts: {} as ResolvedFontConfig<never>,
//     } satisfies Store

//     type InitialStore = typeof initialStore

//     return {
//         implement: implement_theme(initialStore),
//         colors: set_colors(initialStore),
//     } as {
//         implement: ImplementThemeResult<InitialStore>
//         colors: SetColorsResult<InitialStore>
//     }
// }

// type ImplementThemeResult<TStore extends Store> = ReturnType<typeof implement_theme<TStore>>
// function implement_theme<TStore extends Store>(store: TStore) {

//     return <
//         TPackageTheme extends PackageThemeConfig,
//         TVaraintName extends string = keyof TPackageTheme['variants'] extends infer R ? R extends string ? R : never : never,
//     >(
//         config: TPackageTheme,
//         variantName?: TVaraintName,
//     ) => {

//         const colors = {
//             ...store.colors,
//             ...(variantName ? config.variants[variantName]!(config.colors) : config.colors)
//         } as unknown //as Overwrite<TStore['colors'], TPackageTheme['colors']>

//         const fonts = {
//             ...store.fonts,
//             ...config.fonts
//         } as unknown //as Overwrite<TStore['fonts'], TPackageTheme['fonts']>

//         const updatedStore = {
//             ...store,
//             colors,
//             fonts,
//         } as any

//         type UpdatedStore = Overwrite<TStore, { 
//             colors: Overwrite<TStore['colors'], TPackageTheme['colors']>
//             fonts: Overwrite<TStore['fonts'], TPackageTheme['fonts']>
//         }>

//         const result =  {
//             implement: implement_theme(updatedStore),
//             override: perform_override(updatedStore),
//             colors: set_colors(updatedStore),
//             fonts: set_fonts(updatedStore),
//             build: build(updatedStore),
//         } 
//         return result as {
//             implement: ImplementThemeResult<UpdatedStore>
//             override: PerformOverrideResult<UpdatedStore>
//             colors: SetColorsResult<UpdatedStore>
//             fonts: SetFontsResult<UpdatedStore>
//             build: BuildResult<UpdatedStore>
//         }
//     }
// }



// type SetColorsResult<TStore extends Store> = ReturnType<typeof set_colors<TStore>>
// function set_colors<TStore extends Store>(store: TStore) {

//     return <
//         TForbiddenKeys extends ExtractForbiddenKeys<TStore> = ExtractForbiddenKeys<TStore>,
//         TUnresolvedColorConfig extends UnresolvedColorConfig = UnresolvedColorConfig,
//     >(
//         unresolvedColorsCreator: (col: ResolveColorValue) => TUnresolvedColorConfig
//     ) => {

//         const colors = {
//             ...store.colors, 
//             ...resolveColorConfig(unresolvedColorsCreator(resolveColorValue))
//         } 

//         const updatedStore = {
//             ...store,
//             colors,
//         } as Overwrite<TStore, { colors: typeof colors }>
        
//         return {
//             fonts: set_fonts(updatedStore),
//             build: build(updatedStore),
//         } satisfies Chainable
//     }
// }


// type SetFontsResult<TStore extends Store> = ReturnType<typeof set_fonts<TStore>>
// function set_fonts<TStore extends Store>(store: TStore) {

//     return <
//         TForbiddenKeys extends ExtractForbiddenKeys<TStore> = ExtractForbiddenKeys<TStore>,
//         TUnresolvedFontConfig extends UnresolvedFontConfig = UnresolvedFontConfig,
//     >(
//         fonts: TUnresolvedFontConfig
//     ) => {

//         const updatedStore = {
//             ...store,
//             fonts: {
//                 ...store.fonts,
//                 ...resolveFontConfig(fonts)
//             }
//         } 

//         return {
//             build: build(updatedStore),
//         } satisfies Chainable
//     }
// }


// type PerformOverrideResult<TStore extends Store> = ReturnType<typeof perform_override<TStore>>
// function perform_override<TStore extends Store>(store: TStore) {

//     return (
//         colorMods: (col: ResolveColorStringValue) => ModColors<TStore['colors']>
//     ) => {

//         const performOverride = createThemeVariantModifier(colorMods)


//         const updatedStore = {
//             ...store,
//             colors: performOverride(store.colors)
//         }

//         return {
//             build: build(updatedStore),
//         } satisfies Chainable
//     }
// }

// type BuildResult<TStore extends Store> = ReturnType<typeof build<TStore>>
// function build<TStore extends Store>(store: TStore) {

//     return () => {
//         return store
//     }
// }

