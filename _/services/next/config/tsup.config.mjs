import { defineTsupConfig } from "@repo/tsup-config"

export default defineTsupConfig({ isPublished: false }, {
    entry: {
        "src/static-headers/index": "src/static-headers/index.ts",
    },
})
