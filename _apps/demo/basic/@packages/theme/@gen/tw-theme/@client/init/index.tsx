"use client"

// DO NOT MANUALLY EDIT THIS FILE. IT IS GENERATED  & OVERWRITTEN BY [ pnpm theme ]
import { useInit__twThemeGeneric } from "@repo/tw-theme/@client"

import theme from "../../GEN_THEME"
import settings from "../../GEN_THEME_SETTINGS"
import varNames from "../../GEN_THEME_VAR_NAMES"

export const useInit__twTheme = () =>
	useInit__twThemeGeneric({
		colors: theme.colors,
		fonts: theme.fonts,
		settings: settings,
		varNames: varNames,
	})

export function INIT__TwTheme(props: {
	children?: React.ReactNode
}): React.ReactNode {
	useInit__twTheme()
	return props.children ?? null
}
