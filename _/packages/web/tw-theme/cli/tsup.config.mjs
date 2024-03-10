import { defineTsupConfig } from "@repo/tsup-config"

export default defineTsupConfig(
	{ isPublished: false },
	{
		entry: {
			"src/cli/index": "src/cli/index.ts",
		},
        noExternal: [
            "@repo/ts-vars",
            "@repo/tw-theme"
        ]
	},
)
