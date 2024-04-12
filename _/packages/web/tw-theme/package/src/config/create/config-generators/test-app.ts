import { testThemePackage } from "./test-package.js"
import { testThemePackage2 } from "./test-package-2.js"
import { buildAppTheme } from "./app-theme-builder.js"


const ubu = testThemePackage
const ubu2 = testThemePackage2

const theme = buildAppTheme({
    DARKMODE_CSS_CLASSNAME: 'darkmode',
    DARKMODE_LOCALSTORAGE_KEY: 'darkmode',
    OVERRIDE_SYSTEM_PREFRENCE_ON_UNSET: 'light',
})

    .implement(theme => [
        theme(testThemePackage2, 'neo'),
        theme(testThemePackage, 'neo'),
    ])
    .override(col => ({
        "col-a-l": [col.hsl(240, 50, 50), col.hsl(240, 50, 50)]
    }))
    .colors(({ hsl, rgb, hex }) => ({
        "REEE": [[hsl(240, 50, 50), hsl(240, 50, 50)]],
        // "col-a-l": [[rgb(240, 50, 50), rgb(240, 50, 50)], 'ububub'],
    }))
    // .fonts({
    //     "sans": "sans-serif",
    //     "mono": "monospace",
    // })                    
    .build()

const ree = theme.colors['col-a-l']['subType']

const ububub = theme.colors['REEE']['subType']

// const debug = theme.debug