import { PortableText } from '@portabletext/react'

import { SanityLink } from '../../link/components/sanity-link'

import type { PortableTextProps } from '@portabletext/react'
import type { SanityLinkOpts } from '../../link/components/sanity-link'
import type { SanityLinkValue } from '../../link/validation'
import type { SanityRichTextValue } from '../validation'

export type SanityRichTextOpts = SanityRichTextComponentsParams
export type SanityRichTextProps = { value: SanityRichTextValue } & SanityRichTextComponentsParams
export function SanityRichText({ value, linkClassName, renderLinks }: SanityRichTextProps) {


    return <div className={ `flex flex-col gap-3 whitespace-pre-wrap` }>
        <PortableText
            value={ value }
            components={ components({ linkClassName, renderLinks }) }
            onMissingComponent={ (message, options) => {
                console.log('missing component', message, options)
                return <p>Error: Missing component</p>
            } }
        />
    </div>

}


export type SanityRichTextComponentsParams = SanityLinkOpts
const components = ({ linkClassName, renderLinks = true }: SanityRichTextComponentsParams): PortableTextProps["components"] => ({


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