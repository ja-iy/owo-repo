import { buildThemePackage } from "./package-theme-builder";


const theme = buildThemePackage('@repo-theme/test2')
    .colors(({ hsl, rgb, hex }) => ({

        // main
        "col-a-l": [[rgb(240, 50, 50), rgb(240, 50, 50)]],
        "col-b-l": [[hsl(0, 0, 0), hsl(0, 0, 100)]],
        "col-c-l": [[hsl(0, 0, 0), hsl(0, 0, 100)]],

        "col-a-d": [[hsl(0, 0, 0), hsl(0, 0, 100)]],
        "col-b-d": [[hsl(0, 0, 0), hsl(0, 0, 100)]],
        "col-c-d": [[hsl(0, 0, 0), hsl(0, 0, 100)]],

        // accents
        "acc-a-l": [[hsl(255, 84, 60), hsl(255, 84, 60)]],
        "acc-b-l": [[hsl(0, 0, 0), hsl(0, 0, 100)]],
        "acc-c-l": [[hsl(218, 11, 65), hsl(0, 0, 45)]],

        "acc-a-d": [[hsl(0, 0, 0), hsl(0, 0, 100)]],
        "acc-b-d": [[hsl(0, 0, 0), hsl(0, 0, 100)]],
        "acc-c-d": [[hsl(0, 0, 0), hsl(0, 0, 100)]],

        // backgrounds
        "bg-body": [[hsl(0, 0, 100), hsl(240, 10, 4)]],

        "bg-light": [[hsl(0, 0, 100), hsl(240, 10, 4)]],
        "bg-light-hov": [[hsl(240, 10, 4), hsl(0, 0, 100)]],

        "bg-dark": [[hsl(240, 10, 4), hsl(0, 0, 100)]],
        "bg-dark-hov": [[hsl(0, 0, 100), hsl(240, 10, 4)]],

        "bg-a-l": [[hsl(0, 0, 100), hsl(0, 0, 0)]],
        "bg-a-l-hov": [[hsl(0, 0, 0), hsl(0, 0, 100)]],

        "bg-b-l": [[hsl(220, 13, 91), hsl(0, 0, 20)]],
        "bg-b-l-hov": [[hsl(0, 0, 0), hsl(0, 0, 100)]],

        "bg-a-d": [[hsl(0, 0, 0), hsl(0, 0, 100)]],
        "bg-a-d-hov": [[hsl(0, 0, 100), hsl(0, 0, 0)]],

        "bg-b-d": [[hsl(0, 0, 0), hsl(0, 0, 100)]],
        "bg-b-d-hov": [[hsl(0, 0, 100), hsl(0, 0, 0)]],

        // fonts
        "f-light": [[hsl(0, 0, 100), hsl(0, 0, 0)], "font-col-light"],
        "f-dark": [[hsl(0, 0, 0), hsl(0, 0, 100)], "font-col-dark"],
        "link-l": [[hsl(217, 100, 74), hsl(240, 100, 47)], "font-col-link-light"],
        "link-d": [[hsl(240, 100, 47), hsl(217, 100, 74)], "font-col-link-dark"],
        "link-l-visited": [[hsl(259, 58, 71), hsl(260, 36, 53)], "font-col-link-light-visited"],
        "link-d-visited": [[hsl(260, 36, 53), hsl(259, 58, 71)], "font-col-link-dark-visited"],

        "f-a-l": [[hsl(0, 0, 0), hsl(0, 0, 100)], "font-col-a"],
        "f-b-l": [[hsl(0, 0, 0), hsl(0, 0, 100)], "font-col-b"],
        "f-c-l": [[hsl(0, 0, 0), hsl(0, 0, 100)], "font-col-c"],

        "f-a-d": [[hsl(0, 0, 0), hsl(0, 0, 100)], "font-col-a-d"],
        "f-b-d": [[hsl(0, 0, 0), hsl(0, 0, 100)], "font-col-b-d"],
        "f-c-d": [[hsl(0, 0, 0), hsl(0, 0, 100)], "font-col-c-d"],

        // scroll bar
        "col-scroll": [[hsl(0, 0, 0), hsl(0, 0, 100)],],
        "col-scroll-hov": [[hsl(0, 0, 100), hsl(0, 0, 0)],],

        // select
        "col-select": [[hsl(0, 0, 100), hsl(0, 0, 0)],],
        "col-select-bg": [[hsl(0, 0, 0), hsl(0, 0, 100)],],

    }))

    .variants(({ hsl, rgb, hex }) => ({

        'neo': {

            // "uuhuh": [ hsl(0, 0, 0),             hsl(0, 0, 100) ],

            "acc-a-d": [hsl(0, 0, 0), hsl(0, 0, 100)],
        }

    }))


    .build()


// const ree = theme.colors['col-a-l']


// const ububub = theme.variants['neo']


export const testThemePackage2 = theme


// const rede = {
//     a: 1,
//     b: 2,
//     c: 3,
// } as const
// type Red = typeof rede

// type ExclusivePartial<T, K extends keyof T> = Partial<T> | {
//     [P in K]: T[P]
// } extends infer O ? { [P in keyof O]: O[P] } : never;

// function t1<T extends ExclusifyUnion<Partial<Red>>>(a: Partial<Red>) {

//     return a
// }

// type Store = {
//     colors: Record<string, string>
//     // ...
// }

// const createSomeStuff = <TStore extends Store>(store:TStore) => { return {} }

// function Build<const TStore extends Store>(store:TStore){

//     const someStuff = createSomeStuff(store)

//     // return (callback: (<TKey extends Extract<keyof TStore['colors'],string>>(someStuff:unknown) => Partial<Record<TKey, string>>)) => {

//     //     return callback(someStuff)
//     // }

//     return (callback: (<const TKey extends Extract<keyof TStore['colors'],string>>(someStuff:unknown) => {
//         [K in TKey]: K extends keyof TStore['colors'] ? string : never 

//     })) => {

//         return callback(someStuff)
//     }
// }

// const fn = Build({
//     colors: {
//         foo: 'foo',
//         bar: 'bar',
//     }
// })

// // const test = fn(someStuff => ({

// //     foo: 'new-foo',
// //     bar: 'new-bar',

// //     // want to type error on key that is not in store.colors ( keyof TStore['colors'] )
// //     // "error": "T~T",
// // }))





// type AllKeys<T> = T extends unknown ? keyof T : never;
// type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
// type _ExclusifyUnion<T, K extends PropertyKey> =
//     T extends unknown ? Id<T & Partial<Record<Exclude<K, keyof T>, never>>> : never;
// type ExclusifyUnion<T> = _ExclusifyUnion<T, AllKeys<T>>;






type Store = {
    colors: Record<string, string>
    // ...
}

function Build<const TStore extends Store>(store: TStore) {

    const someStuff = {}

    return (
        callback: (someStuff: unknown) => Partial<Record<keyof TStore['colors'], string>>
    ) => {

        return callback(someStuff)
    }
}

const fn = Build({
    colors: {
        foo: 'foo',
        bar: 'bar',
    }
})
