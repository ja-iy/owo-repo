import { getServerSideSitemap } from 'next-sitemap'
import { getSiteUrl } from '@repo/next-utils/site-url'

import { SITE_CONFIG } from '@/config/site-config'
import { objectEntries } from '@repo/ts-utils/object'

type AllowedChangefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
type UrlElemRes = Parameters<typeof getServerSideSitemap>[0][number]
type CreateUrlElemOpts = { lastmod?:Date, changefreq?:AllowedChangefreq, priority?:number }

const createUrlElem = (
    routePath:string,
    {lastmod, changefreq, priority}:CreateUrlElemOpts
):UrlElemRes => ({
    loc: `${getSiteUrl()}${routePath}`,
    lastmod: lastmod?.toISOString() ?? new Date().toISOString(),
    changefreq: changefreq ?? 'weekly',
    priority: priority ?? 0.7,
})


export async function GET(req: NextRequest) {

    const pages:Array<UrlElemRes> = []

    // adds to sitemap for pages that are dynamic / unknown at build time 

    // EXAMPLE
    // /documents/[legal documents]
    // for ( const [key, doc] of objectEntries(SITE_CONFIG.site.legal) ) {
    //     if (doc.enabled){
    //         pages.push(createUrlElem(`/documents/${key}`, {changefreq: 'weekly'}))
    //     }
    // }

    return getServerSideSitemap(pages)
}
