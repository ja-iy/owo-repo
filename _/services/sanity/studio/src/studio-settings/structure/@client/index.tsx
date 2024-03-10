
import { singletonList } from '../../../studio-settings/structure/@client/singleton'
import { modelList } from '../../../studio-settings/structure/@client/model'

import type { StructureToolOptions,  ListItem, ListItemBuilder, Divider } from 'sanity/structure'
import type { CustomSanityStudioSettings } from '../../create.@C'

type Structure =  NonNullable<StructureToolOptions['structure']>

const defaultHiddenTypes = [
    'media.tag',
]

export function sanityDeskStructure(config:CustomSanityStudioSettings):Structure {

    for (const type of defaultHiddenTypes) { config.hide.add(type) }

    const singletonTitleFilter = config.singleton.titleFilter

    return (S, context) => {

        const items:Array<ListItemBuilder | ListItem | Divider> = []


        const singletonSections = config.singleton.types.singletons.items
        if (singletonSections) { 
            for ( const item of singletonSections ) {

                if(singletonTitleFilter) {
                    for (const v of item.items) { 
                        v.structure.title = singletonTitleFilter(v.structure.title) 
                    }
                }

                items.push(singletonList(S, context, item))
            }
            items.push(S.divider()) 
        }

        items.push(...modelList(S, context, config))

        return S.list()
            .title('Content')
            .id('Sanity-Content-Studio')
            .items(items)
    }
}


