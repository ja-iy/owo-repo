import { CspTagSet } from "../utils/csp"


export const CSP_google_fonts = new CspTagSet({
    shared:{
        "style-src": [ 'https://fonts.googleapis.com' ],
        "font-src": [ 'https://fonts.gstatic.com/' ],
    },
    dev: { },
    prod: { },
})
