import type { Reformat } from "@repo/ts-utils/types"
import { resolveToCssVar, resolveToCssVarDark, resolveToCssVarLight, resolveToCssVarNameDark, resolveToCssVarNameLight } from "./name-resolvers"
import type { ResolveCssName } from "./name-resolvers"


// FONTS //

export type FontValue = string

export type FontItem<
    TTwName extends string = string,
    TCssName extends string | undefined = string | undefined,
    TCssNameResolved extends ResolveCssName<TTwName, TCssName> = ResolveCssName<TTwName, TCssName>,
> = {
    type: 'font',
    subType?: undefined,
    twName: TTwName,
    valueLight: FontValue,
    valueDark: FontValue,
    cssName: `-${ TCssNameResolved }`,
    cssNameLight: `--lm${ TCssNameResolved }`,
    cssNameDark: `--dm${ TCssNameResolved }`,
    cssNameVarLight: `var(--lm${ TCssNameResolved })`,
    cssNameVarDark: `var(--dm${ TCssNameResolved })`,
}

export type ResolveFonts<
    T extends UnresolvedFontConfig = UnresolvedFontConfig,
> = {
        [K in keyof T]: K extends string ? Reformat<FontItem<K, T[K]>> : never
    }

// type UnresolvedFontItem<
//     TTwName extends string = string,
//     TCssName extends string | undefined = string | undefined,
// > = [twName: TTwName, cssName?: TCssName]

export type UnresolvedFontItemInput = string

export type UnresolvedFontConfig<TKeys extends string = string> = Record<TKeys, UnresolvedFontItemInput>
export type ResolvedFontConfig<TKeys extends string = string> = Record<TKeys, FontItem>


export function resolveFontItem(twName: string, cssName?: string): FontItem {
    return {
        type: 'font',
        twName,
        valueLight: 'unknown',
        valueDark: 'unknown',
        cssName: resolveToCssVar(cssName ?? twName),
        cssNameDark: resolveToCssVarDark(cssName ?? twName),
        cssNameLight: resolveToCssVarLight(cssName ?? twName),
        cssNameVarDark: resolveToCssVarNameDark(cssName ?? twName),
        cssNameVarLight: resolveToCssVarNameLight(cssName ?? twName),
    }
}

export function resolveFonts(items: Parameters<typeof resolveFontItem>[]): FontItem[] {
    return items.map(item => resolveFontItem(item[0], item[1],))
}

export function resolveFontConfig<
    const TUnresolvedConfig extends UnresolvedFontConfig
>(config: TUnresolvedConfig) {

    const colors = {} as Record<string, FontItem>

    for (const twName in config) {
        colors[twName] = resolveFontItem(twName, config[twName])
    }

    return colors as Reformat<ResolveFonts<TUnresolvedConfig>>

}