import { lsn } from '../../names'
import type { ReferenceFilterResolverContext } from 'sanity'

export function SSSH_uniqueReferenceTo<TRefName extends string = string>(refName:TRefName, listName:string){


    return { 

        type: lsn['reference'], 
        to: { type: refName }, 

        options:{

            filter: ({document}:ReferenceFilterResolverContext) => {

                const existingRefs 
                    = (document?.[listName] as {_ref:string}[]|undefined)
                        ?.map((item)=>item._ref)
                        ?.filter(Boolean)

                if (!existingRefs) return {
                    filter: ''
                }

                return {
                    filter: '!(_id in $existingRefs) && !(_id in path("drafts.**"))',
                    params: {
                        existingRefs
                    }
                }
            }

        } 
    } as const
}
