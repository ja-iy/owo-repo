import { CspTagSet } from "../utils/csp";



export const CSP_base = new CspTagSet({
    shared:{
        "style-src": [ "'unsafe-inline'", ],
        "img-src": [ 'blob:', 'data:', ],
    },
    dev: {
        "script-src": [ "'unsafe-eval'", "'unsafe-inline'" ],
    },
    prod: {
        "script-src": [ "'unsafe-inline'", ], //NEEDS-FIX: cannot use strict csp without forcing dynamic rendering at runtime eg const noune headers.get('x-nounce')
    },
})
