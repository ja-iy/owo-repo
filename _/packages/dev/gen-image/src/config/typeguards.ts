import type { GenerateImages } from "@/config"
import { GEN_IMAGE__CONFIG_ID } from "@/vars"

export function isGenImageConfigs(input: unknown): input is GenerateImages {
    return Boolean(
        input && 
        typeof input === 'object' &&
        'configs' in input &&
        '__ID' in input &&
        input.__ID === GEN_IMAGE__CONFIG_ID
    )
}