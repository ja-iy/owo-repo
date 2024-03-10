export type CssVar = [name:string, val:string] | readonly [name:string, val:string]
export type CssVarArray = Array<CssVar> | Readonly<Array<CssVar>>
import type { Entries } from "type-fest"

export const setCssVars  = (selector:string, data:CssVarArray|Record<string,string>) => {

    const style = ( globalThis?.document?.querySelector(selector) as HTMLElement )?.style

    if (!style) { return }

    const items = Array.isArray(data) ? data : Object.entries(data)

    for (const [name, val] of items){
        style.setProperty(name, val)
    }
}

export const setRootCssVars  = (data:CssVarArray|Record<string,string>) => {

    const style = globalThis?.document.documentElement.style

    if (!style) { return }

    const items = Array.isArray(data) ? data : (Object.entries(data) as Entries<Record<string,string>>)

    for (const [name, val] of items){
        style.setProperty(name, val)
    }
}

export const resetRootCssVars = (data:string[]|readonly string[]) => {
    
        const style = globalThis?.document.documentElement.style
    
        if (!style) { return }
    
        for (const name of data){
            style.removeProperty(name)
        }
}

export function resetCssVars(selector:string, data:string[]|readonly string[]){
    
        const style = ( globalThis?.document?.querySelector(selector) as HTMLElement )?.style
    
        if (!style) { return }
    
        for (const name of data){
            style.removeProperty(name)
        }
}


export const setRootCssvar = (name:string, val:string) => {
    globalThis?.document.documentElement.style?.setProperty(name, val)
}

export const setCssvar = (selector:string ,name:string, val:string) => {
    ( globalThis?.document?.querySelector(selector) as HTMLElement|null )?.style?.setProperty(name, val)
}
