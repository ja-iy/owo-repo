import type { Config } from "tailwindcss"

import { TW_PRESET__base } from "@repo/tailwind-config/base"
import TW_PRESET__shadcn from "@repo-theme/shadcn/tailwind-config"

const config =  {
	content: ["./src/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
	presets: [
        TW_PRESET__base,
        TW_PRESET__shadcn,  
    ],
} satisfies Config


// module.exports = config
export default config
