export type HyphenToUnderscore<T extends string> = T extends `${infer Before}-${infer After}`
    ? `${Before}_${HyphenToUnderscore<After>}`
    : T

export function hyphenToUnderscore<T extends string>(input: T): `${HyphenToUnderscore<T>}` {
    return input.replace(/-/g, '_') as `${HyphenToUnderscore<T>}`
}

export type HyphenToCamel<T extends string> = T extends `${infer Before}-${infer Char}${infer After}`
    ? `${Before}${Uppercase<Char>}${HyphenToCamel<After>}`
    : T

export function hyphenToCamel<T extends string>(input: T): `${HyphenToCamel<T>}` {
    return input.replace(/-./g, (match) => match.charAt(1).toUpperCase()) as `${HyphenToCamel<T>}`
}
