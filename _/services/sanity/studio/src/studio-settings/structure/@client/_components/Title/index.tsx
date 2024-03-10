
//types 
import type { StructureBuilder, StructureResolverContext, Component } from 'sanity/structure'
import type { CustomSanityStudioSettings } from '../../../../create.@C'

type S_TitleOpts = { title:string, id?:string }
export function S_Title(S: StructureBuilder, context:StructureResolverContext, opts:S_TitleOpts) {


    const { title, id } = opts

    return S.listItem()
        .id(id ?? title)
        .title(title)
        .child(
            S.component(() => {
                return <div className={`text-white text-4xl`}>
                    {title}
                </div>
            })  
                .title(title)
                .id(`id-${title}`)
        )

}


type TitleProps = { title:string }
export function ListSubTitle({ title }:TitleProps) {
    return <div className={`text-white text-4xl`}>
        {title}
    </div>
}