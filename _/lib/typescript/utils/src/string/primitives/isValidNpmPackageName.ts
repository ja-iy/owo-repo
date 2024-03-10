export function isValidNpmPackageName(name: string): boolean {

    if (name.startsWith("@")) {
        const [scope, packageName] = name.split("/")
        if(!packageName || !scope) return false
        return /^[a-z0-9_.-]+$/i.test(scope.substring(1)) && isValidNpmPackageName(packageName)
    }

    return /^[a-z0-9_.-]+$/i.test(name)
}