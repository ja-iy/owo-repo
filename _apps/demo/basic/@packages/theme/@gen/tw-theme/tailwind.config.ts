// DO NOT MANUALLY EDIT THIS FILE. IT IS GENERATED  & OVERWRITTEN BY [ pnpm theme ]

import TW_PRESET__repo_theme_radix from "@repo-theme/radix/tailwind-config"
import TW_PRESET__repo_theme_shadcn from "@repo-theme/shadcn/tailwind-config"

/** @type {import('tailwindcss').Config} */
export const TW_CONFIG__demo__basic_theme = {
	content: [],

	theme: {
		extend: {
			colors: {
				owo: "hsl(var(--owo) / <alpha-value>)",
				background: "hsl(var(--background) / <alpha-value>)",
				foreground: "hsl(var(--foreground) / <alpha-value>)",
				muted: "hsl(var(--muted) / <alpha-value>)",
				"muted-foreground":
					"hsl(var(--muted-foreground) / <alpha-value>)",
				popover: "hsl(var(--popover) / <alpha-value>)",
				"popover-foreground":
					"hsl(var(--popover-foreground) / <alpha-value>)",
				card: "hsl(var(--card) / <alpha-value>)",
				"card-foreground":
					"hsl(var(--card-foreground) / <alpha-value>)",
				border: "hsl(var(--border) / <alpha-value>)",
				input: "hsl(var(--input) / <alpha-value>)",
				primary: "hsl(var(--primary) / <alpha-value>)",
				"primary-foreground":
					"hsl(var(--primary-foreground) / <alpha-value>)",
				secondary: "hsl(var(--secondary) / <alpha-value>)",
				"secondary-foreground":
					"hsl(var(--secondary-foreground) / <alpha-value>)",
				accent: "hsl(var(--accent) / <alpha-value>)",
				destructive: "hsl(var(--destructive) / <alpha-value>)",
				"destructive-foreground":
					"hsl(var(--destructive-foreground) / <alpha-value>)",
				ring: "hsl(var(--ring) / <alpha-value>)",
			},
			fontFamily: {
				heading: ["var(--font-heading)"],
			},
		},
	},

	presets: [TW_PRESET__repo_theme_shadcn, TW_PRESET__repo_theme_radix],
}

export default TW_CONFIG__demo__basic_theme
