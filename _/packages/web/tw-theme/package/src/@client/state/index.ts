"use client"

import { z } from "zod"

import { createLocalStorage } from "@repo/ts-local-storage/@client"
import { getTwThemeGlobalContainerGeneric } from "../utils/globalLookup"
import { setDarkmodeClass } from "../utils/set-darkmode-class"



export const themeLocalStroage = {

    'dark-mode': createLocalStorage({
        id: getTwThemeGlobalContainerGeneric()?.settings?.DARKMODE_LOCALSTORAGE_KEY ?? 'dark-mode',
        initialValue: true,
        schema: z.boolean(),
        ignoreHydrationMismatch: true,
    }),

}

export type ThemeLocalStroage = typeof themeLocalStroage
