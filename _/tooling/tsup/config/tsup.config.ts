import { defineConfig } from "tsup"
import { execSync } from "child_process"

export default defineConfig((opts) => ({
    entry:{
        "src/index": "src/index.ts",
    },
	splitting: true,
	format: ["esm", "cjs"],
	dts: false,
	clean: !opts.watch,
	sourcemap: true,
	minify: true,
	outDir: "dist",
	target: "es2022",
	treeshake: true,
    onSuccess: async () => {
        console.log("Generating .d.ts and .d.ts.map files")
        execSync("tsc --emitDeclarationOnly --declaration")
        console.log("Finished Generating .d.ts and .d.ts.map files")
    },
    external:[
        "tsup"
    ],
}))
