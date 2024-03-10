


export type GeneratedThemeVarNames<T extends Readonly<string[]> = Readonly<string[]>> = T
export type GeneratedThemeVarsDark<T extends NameTupleArray = NameTupleArray> = T
export type GeneratedThemeVarsLight<T extends NameTupleArray = NameTupleArray> = T

type NameTupleArray = Readonly<[string, string][]> | [string, string][]