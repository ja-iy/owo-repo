
export const APP_VARS__GLOBAL_LOOKUP_KEY = 'app-vars' as const

export type AppVarsConfig = {
    MOBILE_WIDTH: number
}


const getAppVarsLookup = () => (globalThis as Record<string,unknown>)?.[APP_VARS__GLOBAL_LOOKUP_KEY] as AppVarsConfig | undefined

export const APP_VARS = ():AppVarsConfig => getAppVarsLookup() ?? { 
    MOBILE_WIDTH: 900 
}

export const MOBILE_WIDTH = () => APP_VARS().MOBILE_WIDTH