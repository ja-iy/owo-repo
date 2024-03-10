import { REPO_CONFIG_FOLDER_NAME, REPO_GEN_FOLDER_NAME } from "@repo/ts-vars/web"

export const GEN_IMAGE__GEN_FOLDER_NAME = 'gen-image' as const
export const GEN_IMAGE__GEN_FOLDER_PATH = `/${ REPO_GEN_FOLDER_NAME }/${ GEN_IMAGE__GEN_FOLDER_NAME }` as const

export const GEN_IMAGE__DEFAULT_IMAGES_FILE_NAME = 'index.ts' as const
export const GEN_IMAGE__DEFAULT_IMAGES_FILE_PATH = `${ GEN_IMAGE__GEN_FOLDER_PATH }/${ GEN_IMAGE__DEFAULT_IMAGES_FILE_NAME }` as const

export const GEN_IMAGE__FOLDER_NAME = '@gen-image' as const
export const GEN_IMAGE__FOLDER_PATH = `/${ REPO_GEN_FOLDER_NAME }/${ GEN_IMAGE__FOLDER_NAME }` as const

export const GEN_IMAGE__CONFIG_FILE_NAME = 'gen-image.config.mjs' as const
export const GEN_IMAGE__CONFIG_FILE_PATHS = [
    `/${ GEN_IMAGE__CONFIG_FILE_NAME }`,
    `/${ REPO_CONFIG_FOLDER_NAME }/${ GEN_IMAGE__CONFIG_FILE_NAME }`,
] as const


export const GEN_IMAGE__CONFIG_ID = 'GenerateImagesConfig' as const

export const GEN_IMAGE__SOURCE_BASE_PATH_REQUIREMENT = '/images/' as const
export const GEN_IMAGE__GENERATED_SOURCE_IMAGES_SUBPATH = `public/gen` as const