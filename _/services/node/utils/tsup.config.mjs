import { defineTsupConfig } from "@repo/tsup-config"

export default defineTsupConfig(
	{ isPublished: false },
	{
		entry: {
			"src/file-actions/index": "src/file-actions/index.ts",
            "src/clipboard/index": "src/clipboard/index.ts",
            "src/console/index": "src/console/index.ts",
            "src/file-system/index": "src/file-system/index.ts",
		},
        noExternal: [
            '@repo/ts-vars'
        ]
	},
)
