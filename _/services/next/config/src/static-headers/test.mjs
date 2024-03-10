// import { mergeCspTagSets } from "."

// import { CSP_base } from "."
// import { CSP_google_analytics_4 } from "."
// import { CSP_google_fonts } from "."
// import { CSP_google_recaptcha } from "."
// import { CSP_sanity } from "."
// import { CSP_profile_pictures } from "."
// import { CSP_youtube_embed } from "."
// import { createHeaders } from "./utils/create"
// import { createHeaderItems } from "./utils/create"


// export const NEXT_SECURITY_HEADERS = createHeaders(async () => [

//     {
//         source:'/:path*',
//         headers: process.env.NODE_ENV === "production" 
//             ? prodHeaders({csp: base.prod()})
//             : devHeaders({csp: base.dev()})
//     },

//     {
//         source:'/cms/studio/:path*',
//         headers: process.env.NODE_ENV === "production" 
//             ? prodHeaders({csp: sanity.prod()})
//             : devHeaders({csp: sanity.dev()})
//     } 

// ])

// const devHeaders = createHeaderItems(({csp}) => [
//     { key: 'X-Frame-Options', value: 'DENY' },
//     { key: 'Content-Security-Policy', value: csp },
//     { key: 'X-Content-Type-Options', value: 'nosniff' },
//     // { key: 'Permissions-Policy', value: PERMISSIONS_POLICY_FEATURES },
//     { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
//     { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
//     { key: 'X-XSS-Protection', value: '1; mode=block' },
// ])

// const prodHeaders = createHeaderItems(({csp}) => [
//     { key: 'X-Frame-Options', value: 'DENY' },
//     { key: 'Content-Security-Policy', value: csp },
//     { key: 'X-Content-Type-Options', value: 'nosniff' },
//     // { key: 'Permissions-Policy', value: PERMISSIONS_POLICY_FEATURES },
//     { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
//     { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
//     { key: 'X-XSS-Protection', value: '1; mode=block' },
// ])

// export const base = mergeCspTagSets([
//     CSP_base, 
//     CSP_google_analytics_4, 
//     CSP_google_recaptcha,
//     CSP_google_fonts,
//     CSP_sanity,
//     CSP_profile_pictures(['github']),
//     CSP_youtube_embed,
// ])

// const sanity = mergeCspTagSets([
//     CSP_base, 
//     CSP_google_fonts,
//     CSP_sanity,
//     CSP_profile_pictures(['github']),
//     CSP_youtube_embed,
// ])



