import { type DynamicTsEnv, type CompleteEnvItem, type createDynamicEnv, type createStaticEnv, type CustomLookup, type EnvConfig, type AllowedEnvItem, isAllowedEnvItem } from "../../../next"
import { SetShareableEnvsInBrowser } from "../@client"


type InitDynamicTsEnvProps = {
    config: EnvConfig | AllowedEnvItem[]
    children?: React.ReactNode
}



export function INIT__SERVER__DynamicTsEnv(props: InitDynamicTsEnvProps) {


    return <>

        <SetShareableEnvsInBrowser
            LOOKUP_KEY="GLOBAL_TS_ENV"
            SHAREABLE_LOOKUP={ insertSharableEnvs(props.config) }
        >
            { props.children }

        </SetShareableEnvsInBrowser>

    </>
}

export function insertSharableEnvs(config: InitDynamicTsEnvProps['config'], optionalShareableLookup?: CustomLookup) {

    const shareableLookup = optionalShareableLookup ?? {
        client: {},
        shared: {},
        server: {},
    } as CustomLookup

    let items: AllowedEnvItem[] = []

    if (Array.isArray(config)) items = config
    
    else {
        for (const item of Object.values(config)) {
            if (isAllowedEnvItem(item)) items.push(item)
            else {
                for (const subItem of Object.values(item)) {
                    if (isAllowedEnvItem(subItem)) items.push(subItem)
                }
            }
        }
    }

    for (const item of items) {
        if (item.type === 'static') item.injectShareableEnvsIntoLookup(shareableLookup)
    }

    return shareableLookup
}