import type { SanityClient } from "sanity"

export const minifyGroqQuery = (query: string) => query.replace(/\s+/g, ' ').replace(/\n/g, '')


export type SanityFetchOpts = Parameters<SanityClient['fetch']>['2']



export function transformToValidSanityFetchTag(tag: string) {

    // Remove any characters that are not alphanumeric, underscore, dot, or hyphen
    const cleanedString = tag.replace(/[^a-zA-Z0-9_.-]/g, '.');

    // Trim the string to a maximum length of 75 characters
    const trimmedString = cleanedString.slice(0, 75)

    return trimmedString
}