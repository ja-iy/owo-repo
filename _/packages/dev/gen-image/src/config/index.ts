import path from 'node:path'
import { REPO_ASSETS_FOLDER_NAME, type REPO_GEN_FOLDER_NAME } from '@repo/ts-vars/web'

import { optimizer } from "../cli/utils/optimize/optimizers"
import { GEN_IMAGE__CONFIG_ID, GEN_IMAGE__DEFAULT_IMAGES_FILE_PATH, GEN_IMAGE__GENERATED_SOURCE_IMAGES_SUBPATH, GEN_IMAGE__SOURCE_BASE_PATH_REQUIREMENT } from '@/vars'

export type Optimizer = typeof optimizer
export type OptimizerKeys = keyof Optimizer

export type GenerateImagesOptimizer<TOptimze extends OptimizerKeys> = {
    [key in TOptimze]: Optimizer[key]
}

export type AllowedFileMatcher = 'jpg' | 'jpeg' | 'png' | 'webp'
const defaultFileMatchers = ['.jpg', '.jpeg', '.png', '.webp']

export type GenImageType = 'next'

export function buildGenerateImagesConfig<
    TItems extends Record<string, ReturnType<typeof buildGenerateImagesConfigItem>>
>(items: (item: typeof buildGenerateImagesConfigItem) => TItems) {

    const configs = items(buildGenerateImagesConfigItem)

    return {
        __ID: GEN_IMAGE__CONFIG_ID,
        configs
    }
}



export function buildGenerateImagesConfigItem<
    const TOptimze extends OptimizerKeys[],
    const TGenImageType extends GenImageType,
    const TSourceBasePath extends `/public/${ string }` | `${ string }${ typeof GEN_IMAGE__SOURCE_BASE_PATH_REQUIREMENT }${ string }`,
    const TOptimizeBasePath extends `/public/gen/${ string }`,
    const TImagesOutputFilePath extends `/${ string }.ts`,
    const TFileMatcher extends Array<AllowedFileMatcher> | undefined,
>(opts: {
    type: TGenImageType,
    optimize: OptimizerKeys[],
    sourceBasePath: TSourceBasePath,
    optimizeBasePath: TOptimizeBasePath,
    imagesOutputFilePath?: TImagesOutputFilePath,
    fileMatcher?: TFileMatcher,
    generateSourceFilesIfMissing?: boolean,
}) {

    const hasSourceFiles = opts.sourceBasePath.startsWith(`/public/`)
    const needsSourceFiles = !hasSourceFiles && (opts.generateSourceFilesIfMissing ?? true)
    const generatedSourceBasePath = hasSourceFiles ? opts.sourceBasePath : `/${ GEN_IMAGE__GENERATED_SOURCE_IMAGES_SUBPATH }${ opts.sourceBasePath.slice(opts.sourceBasePath.indexOf(GEN_IMAGE__SOURCE_BASE_PATH_REQUIREMENT)) }`


    const config = {

        fileMatcher: opts?.fileMatcher
            ? new Set(opts.fileMatcher.map(v => `.${ v }`))
            : new Set(defaultFileMatchers),

        source: {
            hasSourceFiles,
            needsSourceFiles,
            path: opts.sourceBasePath,
            genPath: generatedSourceBasePath
            // shiftLength: opts.sourceBasePath.split('\\').length,
        } as const,

        optimize: {
            path: opts.optimizeBasePath,
            // shiftLength: opts.optimizeBasePath.split('\\').length,
        } as const,

        imagesFile: {
            path: opts.imagesOutputFilePath ?? GEN_IMAGE__DEFAULT_IMAGES_FILE_PATH
        } as const,

        optimizer: {} as GenerateImagesOptimizer<TOptimze[number]>,
        optimizeExtensions: opts.optimize,
    }

    opts.optimize.forEach((key) => { config.optimizer[key as TOptimze[number]] = optimizer[key] })

    return config
}

export type GenerateImages = ReturnType<typeof buildGenerateImagesConfig>
export type GenerateImagesConfig = ReturnType<typeof buildGenerateImagesConfigItem>