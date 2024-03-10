import { defineTsupConfig } from "@repo/tsup-config"

export default defineTsupConfig(
	{ isPublished: false },
	{
		entry: {
			"src/init-repo": "src/init-repo.ts",
		},
        noExternal: [
            "@repo/ts-vars"
        ]
	},
)
