import { REPO_GEN_FOLDER_NAME } from "@repo/ts-vars/web"

export const AUTO_IMPORT_GEN__GEN_FOLDER_NAME = 'auto-import-gen' as const
export const AUTO_IMPORT_GEN__GEN_FOLDER_PATH = `${REPO_GEN_FOLDER_NAME}/${AUTO_IMPORT_GEN__GEN_FOLDER_NAME}` as const

export const AUTO_IMPORT_GEN__IMPORT_FILE_NAME = 'imports.ts' as const
export const AUTO_IMPORT_GEN__IMPORT_FILE_PATH = `${AUTO_IMPORT_GEN__GEN_FOLDER_PATH}/${AUTO_IMPORT_GEN__IMPORT_FILE_NAME}` as const

export const AUTO_IMPORT_GEN__ACCEPTED_FILE_TYPES = new Set<string>([
    '.ts', '.tsx', '.js', '.jsx',  '.mjs', '.cjs', '.json'
])

export const AUTO_IMPORT_GEN__IGNORE_EXPORT_KEY_ENDINGS = new Set<string>([
    '.css', '.scss', '.sass', '.less', '.styl', '.stylus', '.html', '.htm', '.md', '.txt', '.yml', '.yaml', '.toml', '.xml', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.mp4', '.mp3', '.wav', '.ogg', '.webm', '.mov', '.avi', '.mkv', '.zip', '.tar', '.gz', '.7z', '.rar', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.tsbuildinfo', '.lock', '.log', '.map', '.patch', 
])

export const AUTO_IMPORT_GEN__IGNORE_PACKAGE_EXPORTS = new Set<string>([

])

export const AUTO_IMPORT_GEN__DO_NOT_CREATE = new Set<string>([
    '@repo/eslint-config',
    '@repo/prettier-config',
    '@repo/tsconfig',
])
