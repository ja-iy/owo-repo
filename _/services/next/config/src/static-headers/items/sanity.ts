import { CspTagSet } from "../utils/csp"

// https://www.sanity.io/manage


export const CSP_sanity = (input: {
    PROJECT_ID: string,
}) => new CspTagSet({
    shared: {

        "img-src": [
            `https://cdn.sanity.io`,
        ],

        "connect-src": [
            `https://api.sanity.io`,
            `https://${ input.PROJECT_ID }.api.sanity.io`,
            `https://${ input.PROJECT_ID }.apicdn.sanity.io`,
            `wss://${ input.PROJECT_ID }.api.sanity.io`,
            `wss://${ input.PROJECT_ID }.apicdn.sanity.io`,
        ],
    },
    dev: {},
    prod: {},
})
