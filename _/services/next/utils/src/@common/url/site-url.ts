import { env } from "../../../src/env.mjs"

type SiteUrlOpts = {
    ngrok?: boolean
}

const defaultSiteUrlOpts: SiteUrlOpts = {
    ngrok: false
}

// get the url for the current environment (relative url in client, absolute url in server)
export function getRelativeSiteUrl(opts: SiteUrlOpts = defaultSiteUrlOpts) {
    if (typeof window !== "undefined") return "" // client should use relative urls
    return getSiteUrl(opts)
}

// get the url for the current environment (always absolute url)
export function getSiteUrl(opts: SiteUrlOpts = defaultSiteUrlOpts) {

    const VERCEL_ENV = env.vercel.get('VERCEL_ENV')

    // production && deployed to vercel
    if (VERCEL_ENV === 'production') { return `https://${env.app.get('NEXT_PUBLIC_PRODUCTION_DOMAIN')}` }
    
    // deployed to vercel
    if (VERCEL_ENV) { return `https://${env.vercel.get('VERCEL_URL')}` }
    
    // localhost with ngrok
    if ( opts?.ngrok && env.devOnly.get('NEXT_PUBLIC_NGROK_ENABLED')) { 
        return env.devOnly.get('NEXT_PUBLIC_NGROK_URL')!
    }

    // localhost
    return `http://localhost:${process.env.PORT ?? 3000}`
}

