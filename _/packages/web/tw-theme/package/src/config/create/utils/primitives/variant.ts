
import type { ModColors, ModColorItem } from "../../../../@client/utils/edit-theme"
import type { PackageJsonName } from "../../config-generators/package-theme-builder"
import { resolveColorStringValue } from "./color"
import type { ResolvedColorConfig, ExtarctColorStringBySubType, ResolveColorStringValue } from "./color"


export type { ModColors, ModColorItem }



export type VariantConfig<
    TResolvedColorConfig extends ResolvedColorConfig = ResolvedColorConfig,
    TPackageJsonName extends PackageJsonName = PackageJsonName,
    TKeys extends string = string,
> = Record<TKeys, VariantModifierItem<TResolvedColorConfig, TPackageJsonName>>
export type VariantModifier<T extends ResolvedColorConfig = ResolvedColorConfig> = (colors: T) => T
export type VariantModifierItem<
    TColors extends ResolvedColorConfig = ResolvedColorConfig,
    TPackageJsonName extends PackageJsonName = PackageJsonName,
> = {
    colors: VariantModifier<TColors>
    packageJsonName: TPackageJsonName,
}

export function createThemeVariantModifier<
    TResolvedColorConfig extends ResolvedColorConfig = ResolvedColorConfig,
    TPackageJsonName extends PackageJsonName = PackageJsonName,
>(
    colorMods: (col: ResolveColorStringValue) => ModColors<TResolvedColorConfig>,
    PackageJsonName: TPackageJsonName,
) {

    return {
        packageJsonName: PackageJsonName,
        colors: (colors: TResolvedColorConfig) => {

            const modColors = colorMods(resolveColorStringValue)

            for (const key in modColors) {
                const modColor = modColors[key]
                const [light, dark] = modColor!
                if (light) colors[key]!.valueLight = light
                if (dark) colors[key]!.valueDark = dark
            }

            return colors
        }
    }
}


export function createThemeVariantsModifierItem<
    TResolvedColorConfig extends ResolvedColorConfig = ResolvedColorConfig,
    TPackageJsonName extends PackageJsonName = PackageJsonName,
>(
    modColors: ModColors<TResolvedColorConfig>,
    PackageJsonName: TPackageJsonName,
) {

    return {
        packageJsonName: PackageJsonName,
        colors: (colors: TResolvedColorConfig) => {


            for (const key in modColors) {
                if (!colors[key]) continue
                const modColor = modColors[key]
                const [light, dark] = modColor!
                if (light) colors[key]!.valueLight = light
                if (dark) colors[key]!.valueDark = dark
            }

            return colors
        }
    }
}
