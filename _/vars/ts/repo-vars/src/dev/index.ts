export * from '../shared/index'

export const REPO_SPECIAL_FOLDERS = [
    'node_modules',
    'dist',
    '.turbo',
    '.next',
    '@gen',
    '.config',
    '.git',
    '.github',
    '.vscode',
    '.idea',
    '.vs',
    '.cache',
    'coverage',
    'public',
    'static',
    'assets',
    'build',
    'out',
    'bin',
]

export const REPO_SPECIAL_FOLDERS_SET = new Set(REPO_SPECIAL_FOLDERS)

export const isIgnoredFolder = (folderName: string) => REPO_SPECIAL_FOLDERS_SET.has(folderName)