

export type MapArray<T extends object[], K extends keyof T[number]> = {
    [P in keyof T]: T[P][K]
}