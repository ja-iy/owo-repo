"use client"

import type { AppVarsConfig } from "../../vars"
import { setAppVars } from ".."


export function INIT_AppVarsClient(props: AppVarsConfig){
    setAppVars(props)
    return null
}