import { buildAppTheme } from "@repo/tw-theme/config"

import shadcn from "@repo-theme/shadcn/theme-config"
import radix from "@repo-theme/radix/theme-config"


const theme = buildAppTheme({
    DARKMODE_CSS_CLASSNAME: 'dark',
    DARKMODE_LOCALSTORAGE_KEY: 'dark-mode',
    OVERRIDE_SYSTEM_PREFRENCE_ON_UNSET: 'dark'
})

    .implement(theme => [
        theme(shadcn),
        theme(radix),
    ])

    .colors(({hsl, rgb, hex}) => ({
        
    }))

    .fonts({
        "heading": "font-heading",
    })                    
    
    .build() 


export default theme