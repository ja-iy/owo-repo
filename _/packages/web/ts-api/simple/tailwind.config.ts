import type { Config } from "tailwindcss"

import { TW_PRESET__base } from "@repo/tailwind-config/base"

export default {
	content: ["./src/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
	presets: [TW_PRESET__base],
} satisfies Config
