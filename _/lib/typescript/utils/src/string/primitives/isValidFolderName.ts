
export function isValidFolderName<
    const TName extends string
>(
    input: TName
): boolean {

    // Define a regular expression for allowed characters (alphanumeric, _, -)
    const validinputRegex = /^[a-zA-Z0-9_@.-]+$/

    // Check if the folder name matches the regular expression
    const isMatch = validinputRegex.test(input)

    // Check if the folder name length is within acceptable limits (1 to 255 characters)
    const isLengthValid = input.length > 0 && input.length <= 255

    // Return true if both the regex match and length check pass
    return isMatch && isLengthValid
}