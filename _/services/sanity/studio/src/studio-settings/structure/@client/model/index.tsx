
import type { CustomSanityStudioSettings } from "../../../create.@C"
import type { StructureBuilder, ListBuilder, StructureResolverContext } from 'sanity/structure'


export function modelList(
    S:StructureBuilder, 
    context:StructureResolverContext, 
    config:CustomSanityStudioSettings,
) {

    const singletonTypes = config.singleton.types.all.set
    const hide = config.hide

    return S.documentTypeListItems()
        .filter(item => { 
            const itemType = item.getId()
            if (!itemType) return false
            return !singletonTypes.has(itemType) && !hide.has(itemType)
        })
}