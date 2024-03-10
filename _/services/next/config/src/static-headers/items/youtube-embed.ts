import { CspTagSet } from "../utils/csp"



export const CSP_youtube_embed = new CspTagSet({
    shared:{

        "script-src": [
            `https://www.youtube.com`,
        ],

        "img-src": [
            `https://*.youtube.com`,
            `https://*.ytimg.com`
        ],

        "connect-src": [ 
            `https://www.youtube.com`,
        ],

        "frame-src": [
            `https://www.youtube.com`,
        ],

        "media-src": [
            `https://www.youtube.com`,
        ],
    },
    dev: {         
        "script-src": [ `http://www.youtube.com` ],
    },
    prod: { },
})
