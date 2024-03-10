import { generateSingletonTypes } from "./structure/@client/_utils/generate-singletons"



type GenerateCustomSanityStudioSettingsParams = { 
    singleton: {
        items: Parameters<typeof generateSingletonTypes>[0] 
        titleFilter?: (title:string) => string,
        disallowedActions: Set<string>,
    }
    hide?: string[]
}

export function generateCustomSanityStudioSettings(input:GenerateCustomSanityStudioSettingsParams){

    const hide = input.hide
    const singleton = input.singleton

    return {
        singleton: {
            types: generateSingletonTypes(singleton.items),
            titleFilter: singleton.titleFilter,
            disallowedActions: singleton.disallowedActions,
        },
        hide: new Set(...hide ?? []),
    }
}

export type CustomSanityStudioSettings = ReturnType<typeof generateCustomSanityStudioSettings>