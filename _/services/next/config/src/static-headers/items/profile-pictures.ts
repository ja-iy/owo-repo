import { CspTagSet } from "../utils/csp"


const config = {
    github: 'https://avatars.githubusercontent.com',
} as const 


export const CSP_profile_pictures = (providers: (keyof typeof config)[]) => {

    const allowedOrigins = providers.map(provider => config[provider])

    return new CspTagSet({
        shared:{
            "img-src": allowedOrigins,
        },
        dev: { },
        prod: { },
    })
}
