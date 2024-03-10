import type { ColorItem } from "./color"
import type { FontItem } from "./font"

export type ResolveCssName<
    TTwName extends string,
    TCssName extends string | undefined,
> =  TCssName extends undefined 
    ? `-${ TTwName }` 
    : TCssName extends infer R ? R extends `-${ string }` ? R : R extends string ? `-${ R }` : never : never



export function resolveToCssVar<const TName extends string>(name: TName): `--${ string }` {
    return name.startsWith('--') ? (name as `--${ string }`) : `--${ name }`
}

export function resolveToCssVarDark<const TName extends string>(name: TName): `--dm-${ string }` {
    return name.startsWith('--') ? `--dm-${ name.slice(2) }` : `--dm-${ name }`
}

export function resolveToCssVarNameDark<const TName extends string>(name: TName): `var(--dm-${ string })` {
    return name.startsWith('--') ? `var(--dm-${ name.slice(2) })` : `var(--dm-${ name })`
}

export function resolveToCssVarLight<TName extends string>(name: TName): `--lm-${ string }` {
    return name.startsWith('--') ? `--lm-${ name.slice(2) }` : `--lm-${ name }`
}

export function resolveToCssVarNameLight<const TName extends string>(name: TName): `var(--lm-${ string })` {
    return name.startsWith('--') ? `var(--lm-${ name.slice(2) })` : `var(--lm-${ name })`
}


export const resolveTailwind = {

    color: (item: ColorItem) => {

        switch (item.subType) {
            case 'hsl': return `hsl(var(${ item.cssName }) / <alpha-value>)`
            case 'rgb': return `rgb(var(${ item.cssName }) / <alpha-value>)`
            case 'hex': return `var(${ item.cssName })`
        }
    },

    font: (item: FontItem) => {
        return `var(${ item.cssName })`
    }
}

