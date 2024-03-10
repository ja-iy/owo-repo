export function stripStringStart(base:string, patterns:Array<string>){
    const len = base.length
    for (const pattern of patterns){
        if (base.startsWith(pattern)) { return base.substring(pattern.length, len) }
    }
    return base
}