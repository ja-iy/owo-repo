import type { Config } from "tailwindcss"

import { TW_PRESET__base, TW_CONTENT__base } from "@repo/tailwind-config/base"
import TW_PRESET__demo__basic from "@demo/basic-theme/tailwind-config"

export default {

    darkMode: ['class'],

    prefix: '',

    content: [
        "./src/**/*.{js,mjs,cjs,jsx,ts,tsx}",
        ...TW_CONTENT__base({ "@demo/basic": { content: false } }),
    ],

    presets: [
        TW_PRESET__base,
        TW_PRESET__demo__basic
    ],


} satisfies Config
