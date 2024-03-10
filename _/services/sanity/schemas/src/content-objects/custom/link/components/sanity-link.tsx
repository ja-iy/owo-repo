import Link from 'next/link'
import { getSiteUrl } from "@repo/next-utils/site-url"
import type { SanityLinkValue } from '../validation'

const defaultLinkStyles = `underline text-link-d visited:text-link-d-visited`

export type SanityLinkOpts = { renderLinks?: boolean, linkClassName?: string }
export type SanityLinkProps = { value?:SanityLinkValue, children:React.ReactNode } & SanityLinkOpts
export function SanityLink({ value, renderLinks=true, linkClassName, children }:SanityLinkProps) {

    const href = value?.href

    if (!href || !renderLinks) return children

    const baseUrl = getSiteUrl()
    const target = value?.blank ? "_blank": undefined

    if (href.startsWith(baseUrl) || href.startsWith('/')) return <span>
        <Link 
            href={href} 
            target={target}
            className={linkClassName ?? defaultLinkStyles}
        >{children}</Link>
    </span>

    return <span>
        <a 
            href={href}
            target={target}
            className={linkClassName ?? defaultLinkStyles} 
        >{children}</a>
    </span>
}
