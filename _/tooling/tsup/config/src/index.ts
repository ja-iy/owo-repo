import { defineConfig } from "tsup"
import { execSync } from "child_process"

import type { Options } from "tsup"



export function defineTsupConfig(
    config: Config,
    opts: Opts,
) {

    return defineConfig((args) => ({

        ...args,

        splitting: true,

        format: ["esm", "cjs"],

        clean: !args.watch || !opts.watch,

        sourcemap: true,

        minify: true,

        outDir: "dist",

        target: "es2022",

        treeshake: true,

        ...config?.noDeclarationMapsOnDev
            ? { // does NOT build declaration maps on dev
                dts: args?.watch
                    ? true
                    : config?.isPublished ? true : false
                ,
                onSuccess: args.watch
                    ? args.onSuccess ?? opts.onSuccess
                    : config?.isPublished
                        ? opts.onSuccess
                        : opts.onSuccess
                            ? async () => {
                                if (typeof opts.onSuccess === 'function') await opts.onSuccess()
                                await generateDts()
                            }
                            : generateDts
                ,
            }
            : {// builds declaration maps on dev
                dts: false,
                onSuccess: config?.isPublished
                    ? opts.onSuccess
                    : opts.onSuccess
                        ? async () => {
                            if (typeof opts.onSuccess === 'function') await opts.onSuccess()
                            await generateDts()
                        }
                        : generateDts
                ,
            },

        ...opts,

        // esbuildOptions(options) {
        //     options.banner = {
        //         js: '"use client"',
        //     }
        // },

    }))

}

// https://tsup.egoist.dev

type Opts = Options & { entry: Record<string, string> }

type Config = {
    isPublished?: boolean
    noDeclarationMapsOnDev?: boolean
}

const generateDts = async () => {
    // we use this to generate .d.ts and .d.ts.map files for intenal packages (allowing go to the definition to work)
    // https://tsup.egoist.dev/#generate-typescript-declaration-maps--d-ts-map
    console.log("Generating .d.ts and .d.ts.map files")
    execSync("tsc -p . --emitDeclarationOnly --declaration --noEmit false")
    console.log("Finished Generating .d.ts and .d.ts.map files")
}