import { defineTsupConfig } from "@repo/tsup-config"

export default defineTsupConfig( { isPublished: false }, {
    entry: {
        "src/core/index": "src/core/index.ts",
        "src/next/index": "src/next/index.ts",
        "src/next/init/@server/index": "src/next/init/@server/index.tsx",
        "src/next/init/@client/index": "src/next/init/@client/index.tsx",
    },
} )

