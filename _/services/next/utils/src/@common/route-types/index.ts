export type CreateRouteProps<
    TParams extends Record<string, string> | null = null,
    TSearchParams extends Record<string, string | string[] | undefined> | null = null
> = {
    params: TParams,
    searchParams?: TSearchParams
}

export type PageProps<
    TParams extends Record<string, string> | null | undefined = null,
    TSearchParams extends Record<string, string | string[] | undefined> | null | undefined = Record<string, string | string[] | undefined> | null
> = {
    params: TParams,
    searchParams: TSearchParams
}


export type LayoutProps<
    TParams extends Record<string, string> | null | undefined = null
> = {
    params: TParams,
    children: React.ReactNode
}


// https://vercel.com/docs/concepts/edge-network/regions#region-list
export type AllowedRegion =
    'arn1' | // arn1	eu-north-1	Stockholm, Sweden
    'bom1' | // bom1	ap-south-1	Mumbai, India
    'cdg1' | // cdg1	eu-west-3	Paris, France
    'cle1' | // cle1	us-east-2	Cleveland, USA
    'cpt1' | // cpt1	af-south-1	Cape Town, South Africa
    'dub1' | // dub1	eu-west-1	Dublin, Ireland
    'fra1' | // fra1	eu-central-1	Frankfurt, Germany
    'gru1' | // gru1	sa-east-1	São Paulo, Brazil
    'hkg1' | // hkg1	ap-east-1	Hong Kong
    'hnd1' | // hnd1	ap-northeast-1	Tokyo, Japan
    'iad1' | // iad1	us-east-1	Washington, D.C., USA
    'icn1' | // icn1	ap-northeast-2	Seoul, South Korea
    'kix1' | // kix1	ap-northeast-3	Osaka, Japan
    'lhr1' | // lhr1	eu-west-2	London, United Kingdom
    'pdx1' | // pdx1	us-west-2	Portland, USA
    'sfo1' | // sfo1	us-west-1	San Francisco, USA
    'sin1' | // sin1	ap-southeast-1	Singapore
    'syd1'   // syd1	ap-southeast-2	Sydney, Australia


// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export type Dynamic = 'auto' | 'force-dynamic' | 'error' | 'force-static'
export type DynamicParams = boolean
export type Revalidate = false | 'force-cache' | 0 | number
export type FetchCache = 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no'
export type Runtime = 'nodejs' | 'edge'
export type PreferredRegion = 'auto' | 'global' | 'home' | AllowedRegion | AllowedRegion[]





// declare global {

//     export type {
//         CreateRouteProps,
//         CreatePageRouteProps,
//         CreateLayoutRouteProps,
//         CreateLayoutProps,
//         RouteConfig,
//         RC,
//         AllowedRegion
//     }
    
// }
