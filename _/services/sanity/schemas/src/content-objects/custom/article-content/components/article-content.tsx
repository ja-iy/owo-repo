import { PortableText } from '@portabletext/react'
import type { PortableTextProps } from '@portabletext/react'

import type { SanityLinkOpts } from '../../link/components/sanity-link'
import { SanityLink } from '../../link/components/sanity-link'
import type { SanityLinkValue } from '../../link/validation'
import type { ArticleContentValue, ArticleContentSubValues } from '../validation'
import Image from 'next/image'

export type ArticleContentOpts = ArticleContentComponentsParams
export type ArticleContentProps = { value: ArticleContentValue } & ArticleContentComponentsParams
export function ArticleContent({ value, linkClassName, renderLinks }: ArticleContentProps) {

    return <PortableText
        value={ value }
        components={ components({ linkClassName, renderLinks }) }
        onMissingComponent={ (message, options) => {
            console.log('missing component', message, options)
            return <p>Error: Missing component</p>
        } }
    />
}


export type ArticleContentComponentsParams = SanityLinkOpts
const components = ({ linkClassName, renderLinks = true }: ArticleContentComponentsParams): PortableTextProps["components"] => ({

    types: {

        image: ({ value }: { value: ArticleContentSubValues["image"] }) => {

            //use sanity client to make query for asset

            return <div className={ `relative max-w-full aspect-video rounded-md overflow-hidden` }>
                {/* <Image
                    
                    fill
                    className={ `object-cover` }
                /> */}
            </div>
        },

    },


    marks: {

        link: ({ value, children }: { value?: SanityLinkValue, children: React.ReactNode }) => {

            return <SanityLink
                value={ value }
                linkClassName={ linkClassName }
                renderLinks={ renderLinks }
            >{ children }</SanityLink>
        },

    },


})