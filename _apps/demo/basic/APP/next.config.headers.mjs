import { env } from "./src/env.mjs"

import {
    createHeaders,
    createHeaderItems,
    mergeCspTagSets,

    CSP_base,
    CSP_google_analytics_4,
    CSP_google_fonts,
    CSP_google_recaptcha,
    CSP_sanity,
    CSP_profile_pictures,
    CSP_youtube_embed,

} from "@repo/next-config/@server/static-headers"



export const NEXT_CONFIG_HEADERS = createHeaders(async () => [

    {
        source: '/:path*',
        headers: process.env.NODE_ENV === "production"
            ? prodHeaders({ csp: base.prod() })
            : devHeaders({ csp: base.dev() })
    },

    {
        source: '/cms/studio/:path*',
        headers: process.env.NODE_ENV === "production"
            ? prodHeaders({ csp: sanity.prod() })
            : devHeaders({ csp: sanity.dev() })
    }

])

const devHeaders = createHeaderItems(({ csp }) => [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Content-Security-Policy', value: csp },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    // { key: 'Permissions-Policy', value: PERMISSIONS_POLICY_FEATURES },
    { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-XSS-Protection', value: '1; mode=block' },
])

const prodHeaders = createHeaderItems(({ csp }) => [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Content-Security-Policy', value: csp },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    // { key: 'Permissions-Policy', value: PERMISSIONS_POLICY_FEATURES },
    { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'X-XSS-Protection', value: '1; mode=block' },
])

const base = mergeCspTagSets([
    CSP_base,
    CSP_google_analytics_4,
    CSP_google_recaptcha,
    CSP_google_fonts,
    // CSP_sanity({ PROJECT_ID: env.sanity.app.get('NEXT_PUBLIC_SANITY_PROJECT_ID') }),
    CSP_profile_pictures(['github']),
    CSP_youtube_embed,
])

const sanity = mergeCspTagSets([
    CSP_base,
    CSP_google_fonts,
    // CSP_sanity({ PROJECT_ID: env.sanity.app.get('NEXT_PUBLIC_SANITY_PROJECT_ID') }),
    CSP_profile_pictures(['github']),
    CSP_youtube_embed,
])



