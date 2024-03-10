import { S_Title } from '../../../../studio-settings/structure/@client/_components/Title'

//types 
import type { StructureBuilder, StructureResolverContext } from 'sanity/structure'
import type { CustomSanityStudioSettings } from '../../../create.@C'

export function singletonList(
    S: StructureBuilder, 
    context:StructureResolverContext, 
    item:NonNullable<CustomSanityStudioSettings['singleton']['types']['singletons']['items']>[number],
) {

    const elems = singletonSectionItems(S, context, item.items)

    const idPrefix = item.title.split(' ').join('-')

    return S.listItem()
        .title(item.title)
        .id(`${idPrefix}-section`)
        .icon(item.icon)
        .child(
            S.list()
                .title(item.title)
                .id(`${idPrefix}-section-items`)
                .items(elems.flat(2)) //singletonListItem(S, item)))
        )        
}

export function singletonSectionItems(S: StructureBuilder, context:StructureResolverContext, items:NonNullable<CustomSanityStudioSettings['singleton']['types']['singletons']['items']>[number]["items"]) {

    return  items.map((item) => singletonListItem(S, item))   
    
}

export function singletonListItem(S: StructureBuilder, displaySettings:NonNullable<CustomSanityStudioSettings['singleton']['types']['singletons']['items']>[number]['items'][number]) {
    const { type, title, icon } = displaySettings.structure
    let item = S.listItem()
        .title(title)
        .id(type)
        .icon(icon)
        .child(S.document()
            // .id(type)
            .schemaType(type)
        )

    if (icon) { item = item.icon(icon) }

    return item
}
