import type { TW_THEME_PACKAGE_NAME_PREFIX } from "../../../vars"

import { resolveColorConfig, resolveColorStringValue, resolveColorValue } from "../utils/primitives/color"
import type { ColorItem, ResolveColorStringValue, ResolveColorValue, ResolvedColorConfig, UnresolvedColorConfig } from "../utils/primitives/color"

import { resolveFontConfig } from "../utils/primitives/font"
import type { ResolvedFontConfig, UnresolvedFontConfig } from "../utils/primitives/font"

import { createThemeVariantModifier, createThemeVariantsModifierItem } from "../utils/primitives/variant"
import type { ModColors, VariantConfig, VariantModifier, VariantModifierItem } from "../utils/primitives/variant"

import type { Overwrite, Reformat } from "@repo/ts-utils/types"

export type PackageJsonName<T extends `${ typeof TW_THEME_PACKAGE_NAME_PREFIX }${ string }` = `${ typeof TW_THEME_PACKAGE_NAME_PREFIX }${ string }`> = T

type Store<
    TPackageJsonName extends PackageJsonName = PackageJsonName,
    TColorConfig extends ResolvedColorConfig = ResolvedColorConfig,
    TFontConfig extends ResolvedFontConfig = ResolvedFontConfig,
    TVariants extends VariantConfig<TColorConfig, TPackageJsonName> = VariantConfig<TColorConfig, TPackageJsonName>,
> = {
    __DU: 'tw-theme-package'
    packageJsonName: TPackageJsonName,
    colors: TColorConfig
    fonts: TFontConfig
    variants: TVariants
}


export type PackageThemeConfig = Overwrite<Store, { variants: VariantConfig<any> }>

type Chainable = Partial<Record<ChainableItem, unknown>>
type ChainableItem =
    | 'colors'
    | 'fonts'
    | 'variants'
    | 'build'


export function buildThemePackage<
    TPackageJsonName extends PackageJsonName,
>(
    packageJsonName: TPackageJsonName,
) {

    const initialStore = {
        __DU: 'tw-theme-package',
        packageJsonName: packageJsonName,
        colors: {} as ResolvedColorConfig<never>,
        fonts: {} as ResolvedFontConfig<never>,
        variants: {} as Record<never, VariantModifierItem>,
    } satisfies Store

    return {
        colors: set_colors(initialStore),
    } satisfies Chainable
}


function set_colors<TStore extends Store>(store: TStore) {

    return <
        TKeys extends string = string,
        TUnresolvedColorConfig extends UnresolvedColorConfig<TKeys> = UnresolvedColorConfig<TKeys>,
    >(
        unresolvedColorsCreator: (col:ResolveColorValue) => TUnresolvedColorConfig
    ) => {

        const updatedStore = {
            ...store,
            colors: resolveColorConfig(unresolvedColorsCreator(resolveColorValue))
        } 

        return {
            fonts: set_fonts(updatedStore),
            variants: create_variants(updatedStore),
            build: build(updatedStore),
        } satisfies Chainable
    }
}


function set_fonts<TStore extends Store>(store: TStore) {

    return <TUnresolvedFonts extends UnresolvedFontConfig>(fonts: TUnresolvedFonts) => {

        const updatedStore = {
            ...store,
            fonts: resolveFontConfig(fonts),
        } 

        return {
            variants: create_variants(updatedStore),
            build: build(updatedStore),
        } satisfies Chainable
    }
}


function create_variants<TStore extends Store>(store: TStore) {

    return <
        const TVaraintNames extends string,
        const TInput extends (col: ResolveColorStringValue) => Record<TVaraintNames,  ModColors<TStore['colors']>>
    >(
        input: TInput
    ) => {

        type VariantItem = Reformat<VariantModifierItem<TStore['colors'], TStore['packageJsonName']>>

        const unresolvedVariants = input(resolveColorStringValue)
        const variants = {} as Record<keyof ReturnType<TInput>, VariantItem>

        for (const variantName in unresolvedVariants) {
            const colorMods = unresolvedVariants[variantName]!
            variants[variantName] = createThemeVariantsModifierItem(colorMods, store.packageJsonName)
        }

        const updatedStore = {
            ...store,
            variants
        } 

        return {
            build: build(updatedStore),
        } satisfies Chainable
    }
}

function build<TStore extends Store>(store: TStore) {

    return () => {
        return store as Reformat<TStore>
    }
}

