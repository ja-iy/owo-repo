
export function parseIntOrError(value: string): number {
    const parsed = parseInt(value, 10)
    if (isNaN(parsed)) { throw new Error('parseInt failed: NaN') }
    return parsed
}