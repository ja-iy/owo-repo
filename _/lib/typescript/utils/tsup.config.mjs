import { defineTsupConfig } from "@repo/tsup-config"

export default defineTsupConfig({ isPublished: false }, {
    entry: {
        "src/http/index": "src/http/index.ts",
        "src/message/index": "src/message/index.ts",
        "src/object/index": "src/object/index.ts",
        "src/string/index": "src/string/index.ts",
        "src/number/index": "src/number/index.ts",
        "src/types/index": "src/types/index.ts",
        "src/validation/index": "src/validation/index.ts",
        "src/@client/css/index": "src/@client/css/index.ts",
        "src/@client/navigator/index": "src/@client/navigator/index.ts",
    },
})
