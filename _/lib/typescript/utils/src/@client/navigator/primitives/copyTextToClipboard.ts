
export const copyTextToClipboard = async (text: string) => {
    try {
        await globalThis?.navigator.clipboard.writeText(text)
        return { success: true }
    } catch {
        return { success: false }
    }
}