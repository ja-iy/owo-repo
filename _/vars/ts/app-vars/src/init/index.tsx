import { APP_VARS__GLOBAL_LOOKUP_KEY  } from "../vars"
import type {AppVarsConfig} from "../vars";
import { INIT_AppVarsClient } from "./@client"


export const setAppVars = (config: AppVarsConfig) => { (globalThis as Record<string,unknown>)[APP_VARS__GLOBAL_LOOKUP_KEY] = config }


export function INIT__SERVER__AppVars(props:AppVarsConfig){
    setAppVars(props)

    return <INIT_AppVarsClient {...props} />
}