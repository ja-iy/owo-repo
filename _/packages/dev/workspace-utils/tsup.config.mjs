import { defineTsupConfig } from "@repo/tsup-config"

export default defineTsupConfig(
	{ isPublished: false },
	{
		entry: {
			"src/pnpm/utils/index": "src/pnpm/utils/index.ts",
		},
        noExternal: [
            "@repo/ts-vars"
        ]
	},
)
