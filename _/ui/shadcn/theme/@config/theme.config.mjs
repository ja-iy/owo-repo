import { buildThemePackage } from "@repo/tw-theme/config"

export default buildThemePackage('@repo-theme/shadcn')

.colors(({hsl, rgb, hex}) => ({

    "background": [             [ hsl(0, 0, 98), hsl(240, 10, 4) ],    ],
    "foreground": [             [ hsl(240, 10, 4), hsl(0, 0, 98) ],    ],    
    
    "muted": [                  [ hsl(240, 5, 96), hsl(240, 4, 16) ],    ],
    "muted-foreground": [       [ hsl(240, 4, 46), hsl(240, 5, 65) ],    ],

    "popover": [                [ hsl(0, 0, 100), hsl(240, 10, 4) ],    ],
    "popover-foreground": [     [ hsl(240, 10, 4), hsl(0, 0, 98) ],    ],

    "card": [                   [ hsl(0, 0, 100), hsl(240, 10, 4) ],    ],
    "card-foreground": [        [ hsl(240, 10, 4), hsl(0, 0, 98) ],    ],

    "border": [                 [ hsl(240, 6, 90), hsl(240, 4, 16) ],    ],
    "input": [                  [ hsl(240, 6, 90), hsl(240, 4, 16) ],    ],

    "primary": [                [ hsl(240, 6, 10), hsl(0, 0, 98) ],    ],
    "primary-foreground": [     [ hsl(0, 0, 98), hsl(240, 6, 10) ],    ],

    "secondary": [              [ hsl(240, 5, 96), hsl(240, 4, 16) ],    ],
    "secondary-foreground": [   [ hsl(240, 6, 10), hsl(0, 0, 98) ],    ],

    "accent": [                 [ hsl(243, 100, 96), hsl(240, 3, 15) ],    ],
    // "accent-foreground": [      [ hsl(0, 0, 100), hsl(240, 10, 4) ]     ],

    "destructive": [            [ hsl(0, 84, 60), hsl(0, 84, 60) ],    ],
    "destructive-foreground": [ [ hsl(0, 0, 98), hsl(0, 86, 97) ],    ],

    "ring": [                   [ hsl(240, 5, 65), hsl(240, 4, 16) ],    ],

}))

.variants(({hsl, rgb, hex}) => ({

    neo: {

        "accent": [ hsl(153, 100, 61), hsl(118, 100, 73) ]        ,
    }
    
}))

.build()



