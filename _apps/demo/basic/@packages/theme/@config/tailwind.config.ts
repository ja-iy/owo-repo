import type { Config } from "tailwindcss"
import plugin from 'tailwindcss/plugin'


import TW_PRESET__theme from "../@gen/tw-theme/tailwind.config"


export const TW_PRESET__demo__basic = {


    theme: {
        extend: {
            
        },
    },


    presets: [
        TW_PRESET__theme,
    ],

    content: [ ],

    plugins: [ ],

    
} satisfies Config

export default TW_PRESET__demo__basic