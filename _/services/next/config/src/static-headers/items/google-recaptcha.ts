import { CspTagSet } from "../utils/csp"


// https://developers.google.com/recaptcha/docs/faq#im-using-content-security-policy-csp-on-my-website.-how-can-i-configure-it-to-work-with-recaptcha


export const CSP_google_recaptcha = new CspTagSet({
    shared:{
        "script-src": [ 'https://www.google.com/recaptcha/', 'https://www.gstatic.com/recaptcha/' ],
        "frame-src": [ 'https://www.google.com/recaptcha/', 'https://recaptcha.google.com/recaptcha/' ],
    },
    dev: { },
    prod: { },
})
