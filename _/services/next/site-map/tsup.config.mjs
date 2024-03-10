import { defineTsupConfig } from "@repo/tsup-config"

export default defineTsupConfig({ isPublished: false }, {
    entry: {
        "src/config/index": "src/config/index.ts",
    },
})
