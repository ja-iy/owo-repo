import { REPO_CONFIG_FOLDER_NAME, REPO_GEN_FOLDER_NAME } from "@repo/ts-vars/web"

export const TW_THEME_PACKAGE_NAME_PREFIX = '@repo-theme/' as const

export const TW_THEME_CONFIG_FILE_NAME = 'theme.config.mjs' as const

export const TW_THEME_VARAINTS_CONFIG_FOLDER_NAME = 'theme-variants' as const

export const TW_THEME_VARAINTS_CONFIG_FOLDER_PATH = `${ REPO_CONFIG_FOLDER_NAME }/${ TW_THEME_VARAINTS_CONFIG_FOLDER_NAME }` as const

export const TW_THEME_GEN_FOLDER_NAME = `${ REPO_GEN_FOLDER_NAME }/tw-theme` as const

export const TW_THEME_GLOBAL_CONTAINER_NAME = 'tw-theme-data' as const

export const TW_THEME_GLOBAL_CONTAINER_KEY = 'tw-theme' as const

export const TW_THEME_TSCONFIG_FILE_NAME = 'tsconfig.theme.json' as const

export const TW_THEME_TSCONFIG_FILE_PATH = `${TW_THEME_TSCONFIG_FILE_NAME}` as const



export type TW_THEME_GLOBAL_CONTAINER = {

    darkModeKey: string

}
