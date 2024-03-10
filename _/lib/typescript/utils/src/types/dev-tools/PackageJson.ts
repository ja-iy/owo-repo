export type PackageJson = {
    name: string
    version: string
    description: string
    main: string
    scripts: Record<string, string>
    keywords: string[],
    exports: Record<string, Record<'import' | 'require' | 'types' | 'default' | 'node' , `./${string}`>>
    peerDependencies: Record<string, string>
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
}