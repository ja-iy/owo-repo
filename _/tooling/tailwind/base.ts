import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

type AppName = string
type AppContentItem = { content?: boolean }

export const tailwindPackageContentConfig = {

    '@repo/sanity-schemas' : { type: 'src' },
    '@repo/next-utils' : { type: 'src' },
    '@repo-ui/shadcn' : { type: 'src' },

} as const 

const staticContent = Object.entries(tailwindPackageContentConfig).map(([packageName, v]) =>(
    `./node_modules/${packageName}/src/**/*.{js,mjs,cjs,jsx,ts,tsx}`
))

export const TW_CONTENT__base = (input:Record<AppName,AppContentItem>) => {
    
    for (const [appName, appContent] of Object.entries(input)) {
        if (appContent.content) staticContent.push( `./node_modules/${appName}-content/src/**/*.{js,mjs,cjs,jsx,ts,tsx}` )
    }

    return staticContent
}


export const TW_PRESET__base = {

    "theme": {

        extend: {

            colors: {
                "clear": 'transparent',
            },

            

        },
    },

    plugins: [

      

    ]

} satisfies Partial<Config>

export default TW_PRESET__base
