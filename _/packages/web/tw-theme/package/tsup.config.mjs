import { defineTsupConfig } from "@repo/tsup-config"

export default defineTsupConfig(
	{ isPublished: false },
	{
		entry: {
            "src/@client/index": "src/@client/index.ts",
			"src/config/index": "src/config/index.ts",
            "src/utils/index": "src/utils/index.ts",
            "src/vars/index": "src/vars/index.ts",
		},
        noExternal: [
            "@repo/ts-vars",
        ]
	},
)
