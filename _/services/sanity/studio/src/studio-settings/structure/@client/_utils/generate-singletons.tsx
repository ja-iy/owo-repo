import { 
    Database as SingletonIcon,
    Text as DataIcon,
    FileText as PageIcon,
} from "lucide-react"

//types
import type { ListItemBuilder } from "sanity/structure"

const DEFAULT_SINGLETON_ICON = SingletonIcon

type GenerateSingletonParams =  SingletonStructureResolver<SingletonStudioDisplaySettings>


export function generateSingletonTypes(raw:GenerateSingletonParams){

    
    const singletonTypes = new Set<string>()
    const singletons = !raw 
        ? undefined
        : raw(singletonArgs)
            .map((section, i) => {
                section.items.map((item, j) => {
                    singletonTypes.add(item.structure.type)
                    return item
                })
                return section
            })

    
    return {
        all: { set: new Set([...singletonTypes]) },
        singletons: { items:singletons, types: new Set(singletons) },
    } as const
}

type SanityStructureIcon = Parameters<ListItemBuilder["icon"]>[0]

function structureSection<TItem>(title:string, items:StructureSingletonItem<TItem>[], icon?:SanityStructureIcon){ 
    return {
        _DUtype: 'section' as const,
        title,
        items: items,
        icon: icon,
    }
}

function generateStructureSingletonItem<TItem>(itemResolver:(item:TItem, icon?:TItem extends string ? SanityStructureIcon : never)=>Exclude<TItem, string>){ 
    
    return (item:TItem, icon?:TItem extends string ? SanityStructureIcon : never) => ({ 
        _DUtype: 'item' as const,
        structure: itemResolver(item, icon),
    })
}

type StructureSectionGenerator<TItem> = typeof structureSection<TItem>
type StructureSection<TItem> = ReturnType<typeof structureSection<TItem>>

type StructureSingletonItemGenerator<TItem> = ReturnType<typeof generateStructureSingletonItem<TItem>>
type StructureSingletonItem<TItem> = ReturnType<StructureSingletonItemGenerator<TItem>>


type SingletonStructureResolverParams<TItem> = { section:StructureSectionGenerator<TItem>, item:StructureSingletonItemGenerator<TItem|string> }
type SingletonStructureResolver<TItem> = (params:SingletonStructureResolverParams<TItem>) => StructureSection<TItem>[]



const singletonItemResolver = (item:SingletonStudioDisplaySettings|string, icon?:SanityStructureIcon) => {
    if( typeof item === 'string' ){ return defaultSingletonDisplaySetings(item, icon) }
    else { 
        item.icon = item.icon ?? icon ?? DEFAULT_SINGLETON_ICON
        return item 
    }
}

const singletonArgs = { section:structureSection<SingletonStudioDisplaySettings>, item:generateStructureSingletonItem<SingletonStudioDisplaySettings | string>(singletonItemResolver) }

type SingletonStudioDisplaySettings = {
    type: string,
    title: string,
    icon?: SanityStructureIcon,
}



function defaultSingletonDisplaySetings(type:string, icon?:SanityStructureIcon):SingletonStudioDisplaySettings{
    return {
        type,
        title: type.replace(/-/g, ' '),
        icon: icon ?? DEFAULT_SINGLETON_ICON,
    }
}