import { hyphenToCamel } from "@repo/ts-utils/string"

import type { HyphenToCamel } from "@repo/ts-utils/string"
import type { Overwrite, Reformat } from "@repo/ts-utils/types"



export type InputArray = readonly string[] | string[]
export type ContentType = 'singleton' | 'model'

export type RoutePath =
    | (<TId extends string>(id: TId) => `/${ string }`)
    | `/${ string }`

export const getRoutePath = <
    TId extends string,
    TRoutePath extends RoutePath
>(
    routePath: TRoutePath,
    id: TId
) => {
    if (typeof routePath === 'function') return routePath(id)
    return routePath
}


export type UniqueCacheTag<
    TName extends string,
    TId extends string,
> = `${ TName }.${ TId }`

export type UniqueCacheTagResolver<
    TName extends string,
> = <TId extends string>(id: TId) => UniqueCacheTag<TName, TId>


export type DefaultSingletonCacheTags<
    TName extends string,
> = readonly ['all', 'content', TName]

export type DefaultModelCacheTagsResolver<
    TName extends string,
> = <TId extends string>(id?: TId) => typeof id extends infer R ? R extends undefined
    ? readonly ['all', 'content', TName]
    : readonly ['all', 'content', TName, UniqueCacheTag<TName, TId>]
    : never

export type DefaultSingletonFetchTag<
    TName extends string,
> = TName

type DefaultModelFetchTagResolver<
    TName extends string,
> = <TId extends string>(id?: TId) => typeof id extends infer R ? R extends undefined
    ? TName
    : UniqueCacheTag<TName, TId>
    : never


export type AppContentMetaIn = {
    required?: boolean,
    ogType?: OgType | boolean | undefined
    twitterCard?: TwitterCardType | boolean | undefined
} | boolean | undefined

export type AppContentMeta = {
    required: boolean,
    ogType: OgType | false
    twitterCard: TwitterCardType | false
}

export type TransformAppContentMeta<T extends AppContentMetaIn> = T extends boolean
    ? T extends true ? DefaultAppContentMeta : false
    : T extends object
    ? Overwrite<T, {
        required: T['required'] extends boolean ? T['required'] : DefaultAppContentMeta['required']
        ogType: T['ogType'] extends boolean
            ? T['ogType'] extends true ? DefaultAppContentMeta['ogType'] : false
            : T['ogType'] extends OgType ? T['ogType'] : DefaultAppContentMeta['ogType']
        twitterCard: T['twitterCard'] extends boolean
            ? T['twitterCard'] extends true ? DefaultAppContentMeta['twitterCard'] : false
            : T['twitterCard'] extends TwitterCardType ? T['twitterCard'] : DefaultAppContentMeta['twitterCard']
    }>
    : false

type meta = {
    required: true
    ogType: false,
    twitterCard: false
}

type ree = TransformAppContentMeta<meta>


export const defaultAppContentMeta = {
    required: false,
    ogType: "website",
    twitterCard: "summary",
} as const satisfies AppContentMeta

type DefaultAppContentMeta = typeof defaultAppContentMeta

export type AppContentItemInternal<

    TName extends string = string,
    TConfigIn extends ConfigIn = ConfigIn,

    TType extends ContentType = TConfigIn['type'],
    TIdKey extends string = TConfigIn['idKey'],
    TRoutePath extends RoutePath | undefined = TConfigIn['routePath'],
    TFetchTags extends InputArray = TConfigIn['fetchTags'],
    TCacheTags extends InputArray = TConfigIn['cacheTags'],
> = {

    _DU: `content.${ TType }`
    baseCacheTag: TName,
    uniqueCacheTag: UniqueCacheTagResolver<TName>,

    name: TName,
    type: TType,
    idKey: TIdKey,
    routePath: TRoutePath,
    fetchTags: TFetchTags,
    cacheTags: TCacheTags,
    meta: TransformAppContentMeta<TConfigIn['meta']>,

    defaultFetchTag: TType extends 'singleton'
        ? DefaultSingletonFetchTag<TName>
        : DefaultModelFetchTagResolver<TName>
    ,

    defaultCacheTags: TType extends 'singleton'
        ? DefaultSingletonCacheTags<TName>
        : DefaultModelCacheTagsResolver<TName>
    ,

}

export type AppContentItem<

    TName extends string = string,
    TConfigIn extends ConfigIn = ConfigIn,

    TType extends ContentType = TConfigIn['type'],
    TIdKey extends string = TConfigIn['idKey'],
    TRoutePath extends RoutePath | undefined = TConfigIn['routePath'],
    TFetchTags extends InputArray = TConfigIn['fetchTags'],
    TCacheTags extends InputArray = TConfigIn['cacheTags'],
    TMeta extends AppContentMeta | false = AppContentMeta | false,
> = {

    _DU: `content.${ TType }`
    baseCacheTag: TName,
    uniqueCacheTag: UniqueCacheTagResolver<TName>,

    name: TName,
    type: TType,
    idKey: TIdKey,
    routePath: TRoutePath,
    fetchTags: TFetchTags,
    cacheTags: TCacheTags,
    meta: TMeta,

    defaultFetchTag: TType extends 'singleton'
        ? DefaultSingletonFetchTag<TName>
        : DefaultModelFetchTagResolver<TName>
    ,

    defaultCacheTags: TType extends 'singleton'
        ? DefaultSingletonCacheTags<TName>
        : DefaultModelCacheTagsResolver<TName>
    ,

}

export type ConfigIn<
    TType extends ContentType = ContentType,
    TIdKey extends string = string,
    TRoutePath extends RoutePath | undefined = RoutePath | undefined,
    TFetchTags extends InputArray = InputArray,
    TCacheTags extends InputArray = InputArray,
    TMeta extends AppContentMetaIn = AppContentMetaIn,
> = {
    type: TType,
    idKey: TIdKey,
    routePath: TRoutePath,
    fetchTags: TFetchTags,
    cacheTags: TCacheTags,
    meta?: TMeta,
}

export function defineAppContentItem<
    const TName extends string,
    const TType extends ContentType,
    const TIdKey extends string,
    const TRoutePath extends RoutePath | undefined,
    const TFetchTags extends InputArray,
    const TCacheTags extends InputArray,
    const TMeta extends AppContentMetaIn,
>(
    name: TName,
    config: ConfigIn<TType, TIdKey, TRoutePath, TFetchTags, TCacheTags, TMeta>
) {

    type ReturnShape = AppContentItemInternal<TName, ConfigIn<TType, TIdKey, TRoutePath, TFetchTags, TCacheTags, TMeta>>

    const type = config.type
    const cacheTags = config.cacheTags

    return {

        _DU: `content.${ config.type }`,
        baseCacheTag: name,
        uniqueCacheTag: (id) => `${ name }.${ id }` as const,

        name: name,
        type: config.type,
        idKey: config.idKey,
        routePath: config.routePath as TRoutePath extends infer R ? R extends undefined ? undefined : TRoutePath : never,
        fetchTags: config.fetchTags,
        cacheTags: config.cacheTags,
        meta: (config.meta
            ? typeof config.meta === 'boolean'
                ? defaultAppContentMeta
                : {
                    "required": config.meta.required ?? defaultAppContentMeta.required,
                    "ogType": typeof config.meta.ogType === 'boolean'
                        ? config.meta.ogType ? defaultAppContentMeta.ogType : false
                        : config.meta.ogType ?? defaultAppContentMeta.ogType,
                    "twitterCard": typeof config.meta.twitterCard === 'boolean'
                        ? config.meta.twitterCard ? defaultAppContentMeta.twitterCard : false
                        : config.meta.twitterCard ?? defaultAppContentMeta.twitterCard,
                }
            : false
        ) as any,
        defaultFetchTag: (
            type === 'singleton'
                ? name satisfies DefaultSingletonFetchTag<TName>
                : ((id?) => id ? `${ name }.${ id }` : name) as DefaultModelFetchTagResolver<TName>
        ) as unknown as ReturnShape['defaultFetchTag'],

        defaultCacheTags: (
            type === 'singleton'
                ? ['all', 'content', name] satisfies DefaultSingletonCacheTags<TName>
                : ((id?) => id ? ['all', 'content', name, `${ name }.${ id }`] : ['all', name]) as DefaultModelCacheTagsResolver<TName>
        ) as ReturnShape['defaultCacheTags'],


    } as ReturnShape
}



export function defineAppContentConfig<
    const TConfig extends Record<string, ConfigIn>
>(
    config: TConfig
) {

    type Name = Extract<keyof TConfig, string>
    // type TrueName<TName extends Name> = HyphenToUnderscore<TName>
    type TrueName<TName extends Name> = HyphenToCamel<TName>

    type Names = Reformat<{ [K in Name]: TrueName<K> }>
    const names = {} as Record<Name, unknown>

    type Config = { [K in Name]: Reformat<AppContentItemInternal<TrueName<K>, TConfig[K]>> }
    const items = {} as Record<Name, unknown>


    for (const name in config) {

        const trueName = hyphenToCamel(name) as TrueName<Name>

        items[name] = defineAppContentItem(trueName, config[name]!)
        names[name] = trueName
    }

    return {
        config: items as Config,
        names: names as Names,
    }
}



export const ogTypes = [
    'website',
    'article',
    'book',
    'profile',
    'music.song',
    'music.album',
    'music.playlist',
    'music.radio_station',
    'video.movie',
    'video.episode',
    'video.tv_show',
    'video.other',
] as const

export type OgType = typeof ogTypes[number]


export const twitterCardTypes = [
    'summary',
    'summary_large_image',
    'app',
    'player',
] as const

export type TwitterCardType = typeof twitterCardTypes[number]