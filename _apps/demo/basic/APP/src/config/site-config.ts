
import type { AllowedRegion } from "@repo/next-utils/route-types"
import { APP_VARS } from "@repo/app-vars"

const vars = APP_VARS()

export const MOBILE_WIDTH = vars.MOBILE_WIDTH
export const SITE_TITLE = 'Demo App' as const
export const SITE_EXTERNAL_LOGO_URL = 'https://demo-app.com/logo.png' as const

export const SITE_CONFIG = {

    api: {
        edgeRegion: 'iad1' satisfies AllowedRegion,
        qstashTopics: [] satisfies string[],
    },

    site: {
        domain: "owo-repo.vercel.app",
        brandName: 'Demo App',
        brandNameShort: 'Demo App',
        contactEmail: 'you@demo-app.com',
        contactPhone: 'none',

        legal: {
            'cookie-policy':                    { enabled: true, footerNav: true, label: 'Cookie Policy' }, 
            'privacy-policy':                   { enabled: true, footerNav: true, label: 'Privacy Policy' }, 
        } as const,
    },

    credits: {
        brandName: 'Demo App',
        brandUrl: 'https://demo-app.com',
    },

} as const

export type SITE_CONFIG_TYPE = typeof SITE_CONFIG
export type QSTASH_TOPICS = SITE_CONFIG_TYPE['api']['qstashTopics'][number]