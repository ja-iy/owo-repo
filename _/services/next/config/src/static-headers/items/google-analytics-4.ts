import { CspTagSet } from "../utils/csp"


// https://developers.google.com/tag-platform/tag-manager/csp#universal_analytics_google_analytics
// https://developers.google.com/tag-platform/tag-manager/csp#google_analytics_4_google_analytics


export const CSP_google_analytics_4 = new CspTagSet({
    shared:{
        "script-src": [ 'https://www.google-analytics.com', 'https://*.googletagmanager.com',  'https://ssl.google-analytics.com', ],
        "img-src": [ 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com', 'https://*.g.doubleclick.net', 'https://*.google.com',  ],
        "connect-src": [ 'https://www.google-analytics.com', 'https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com', 'https://*.g.doubleclick.net', 'https://*.google.com',  ],
    },
    dev: { },
    prod: { },
    scriptSrcHashes: [

    ],
})
