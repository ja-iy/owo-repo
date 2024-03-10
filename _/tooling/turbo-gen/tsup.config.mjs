import { defineTsupConfig } from "@repo/tsup-config"

export default defineTsupConfig({ isPublished:false }, {
    entry: {
        "src/index": "src/index.ts",
    },
})
