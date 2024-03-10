import {
	Arimo,
	Inter,
	Josefin_Slab,
	Montserrat,
	Roboto,
} from "next/font/google"
import localFont from "next/font/local"
import type { GEN_THEME__demo__basic_theme as THEME } from "@demo/basic-theme/@gen/theme"

type Fonts = (typeof THEME)["fonts"]
type FontCssVarName = {
	[key in keyof Fonts]: Fonts[key]["cssName"]
}[keyof Fonts]

export const fontHeading = Montserrat<FontCssVarName>({
	variable: "--font-heading",
	weight: "variable",
	subsets: ["latin"],
	display: "swap",
})

export const fontVars = [fontHeading.variable].join(" ")
