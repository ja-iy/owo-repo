import { z, ZodType, ZodError } from 'zod'

export * from '../_utils/helpers'

const CLIENT_PREFIX = "NEXT_PUBLIC_" as const
type ClientPrefix = typeof CLIENT_PREFIX
type ClientKey = `${ ClientPrefix }${ string }`

export type CustomLookup = {
    client: { [key: string]: string | undefined }
    shared: { [key: string]: string | undefined }
    server: { [key: string]: string | undefined }
}

export type CustomLookupContainer = { [DynamicTsEnv.LOOKUP_KEY]: CustomLookup | undefined }

type EnvTypes = 'client' | 'server' | 'shared'

type ClientEnvItem = [type: 'client', schema: ZodType, processEnvKey?: string]
type ServerEnvItem = [type: 'server', schema: ZodType, processEnvKey?: string]
type SharedEnvItem = [type: 'shared', schema: ZodType, processEnvKey?: string]

type CompleteClientEnvItem = [type: 'client', schema: ZodType, processEnvKey: string]
type CompleteServerEnvItem = [type: 'server', schema: ZodType, processEnvKey: string]
type CompleteSharedEnvItem = [type: 'shared', schema: ZodType, processEnvKey: string]


export type EnvItem = ClientEnvItem | ServerEnvItem | SharedEnvItem
export type CompleteEnvItem = CompleteClientEnvItem | CompleteServerEnvItem | CompleteSharedEnvItem

type EnforceClientType<T extends EnvItem> = T extends ClientEnvItem ? T : ClientEnvItem
type EnforceServerType<T extends EnvItem> = T extends ServerEnvItem ? T : never
type EnforceSharedType<T extends EnvItem> = T extends SharedEnvItem ? T : never

export type Envs = Record<string, EnvItem>
export type CompleteEnvs = Record<string, CompleteEnvItem>

export type PrefixLookup = Record<string, string>

export type Config = {
    prefix?: string,
    shareable?: boolean,
    serverCheck?: ServerCheck,
    onValidationError?: OnValidationError,
    onServerError?: OnServerError,
}

type ServerCheck = () => boolean

type OnValidationErrorArgs<
    TSchema extends ZodType,
> = {
    key: string
    processEnvKey: string
    parser: ReturnType<TSchema['safeParse']>
}
type OnValidationError = <TSchema extends ZodType>(args: OnValidationErrorArgs<TSchema>) => never

type OnServerErrorArgs<TType extends EnvTypes> = {
    key: string
    processEnvKey: string
    type: TType
}
type OnServerError = <TType extends EnvTypes>(args: OnServerErrorArgs<TType>) => never


const defaults = {

    serverCheck: () => typeof window === 'undefined',

    onValidationError: <TSchema extends ZodType>(item: OnValidationErrorArgs<TSchema>) => {
        if (!item.parser.success) throw Error(`INVALID ENV ${ item.processEnvKey }: ${ item.parser.error.message }`)
        throw Error(`INVALID ENV ${ item.processEnvKey }`)
    },

    onServerError: <TType extends EnvTypes>(item: OnServerErrorArgs<TType>) => {
        throw Error(`❌ Attempted to access a server-side environment variable on the client, ${ item.key }`)
    },

}


class DynamicTsEnv<
    TEnvs extends CompleteEnvs = CompleteEnvs,
    TConfig extends Config = Config,
// TCompleteEnvs extends CompleteEnvs = CompleteEnvs
> {


    public static LOOKUP_KEY = 'GLOBAL_TS_ENV' as const;

    public staticEnvsPopulated = false
    public injectShareableEnvs = false

    public type: 'static' | 'dynamic' = 'dynamic'

    public __ID = DynamicTsEnv.LOOKUP_KEY

    protected readonly serverCheck: NonNullable<TConfig['serverCheck']>
    protected readonly onValidationError: NonNullable<TConfig['onValidationError']>
    protected readonly onServerError: NonNullable<TConfig['onServerError']>
    protected readonly prefix?: string

    protected rawEnvs = {
        client: {} as { [K in keyof TEnvs]: TEnvs[K][0] extends 'client' ? string : never },
        shared: {} as { [K in keyof TEnvs]: TEnvs[K][0] extends 'shared' ? string : never },
        server: {} as { [K in keyof TEnvs]: TEnvs[K][0] extends 'server' ? string : never },
    }

    protected parsedEnvs = {
        client: {} as { [K in keyof TEnvs]: TEnvs[K][0] extends 'client' ? ReturnType<TEnvs[K][1]['parse']> : never },
        shared: {} as { [K in keyof TEnvs]: TEnvs[K][0] extends 'shared' ? ReturnType<TEnvs[K][1]['parse']> : never },
        server: {} as { [K in keyof TEnvs]: TEnvs[K][0] extends 'server' ? ReturnType<TEnvs[K][1]['parse']> : never },
    }

    constructor (
        public readonly envs: TEnvs,
        config?: TConfig,
        protected prefixLookup?: PrefixLookup,
    ) {

        this.envs = envs
        this.serverCheck = config?.serverCheck ?? defaults.serverCheck
        this.onValidationError = config?.onValidationError ?? defaults.onValidationError
        this.onServerError = config?.onServerError ?? defaults.onServerError
        this.prefix = config?.prefix
        this.prefixLookup = prefixLookup

    }

    public static addPrefixToKey<T extends string>(key: T, type: EnvTypes, prefix: string, clientPrefix :string, prefixLookup:Record<string, unknown>) {
        const prefixedKey = type === 'client'
            ? clientPrefix + '_' + key.slice(CLIENT_PREFIX.length)
            : prefix + '_' + key
        prefixLookup[key] = prefixedKey
        return prefixedKey
    }

    public static buildStatic<
        const TEnvsS extends Envs,
        const TConfigS extends Config
    >(
        envs: {
            [K in keyof TEnvsS]: K extends ClientKey ? EnforceClientType<TEnvsS[K]> : EnforceServerType<TEnvsS[K]> | EnforceSharedType<TEnvsS[K]>
        },
        config?: TConfigS
    ) {

        return DynamicTsEnv.buildDynamic(envs, config).resolve()
    }

    public static buildDynamic<
        const TEnvsD extends Envs,
        const TConfigD extends Config
    >(
        envs: {
            [K in keyof TEnvsD]: K extends ClientKey ? EnforceClientType<TEnvsD[K]> : EnforceServerType<TEnvsD[K]> | EnforceSharedType<TEnvsD[K]>
        },
        config?: TConfigD
    ) {
        let prefixLookup = undefined
        if (config?.prefix) {
            prefixLookup = {} as PrefixLookup
            const prefix = config.prefix
            const clientPrefix = CLIENT_PREFIX + prefix

            const newEnvs = envs as Record<string, EnvItem>

            for (const key in envs) {
                const [type, schema, processEnvKey] = envs[key] as TEnvsD[typeof key]

                const newKey = DynamicTsEnv.addPrefixToKey(key, type, prefix, clientPrefix, prefixLookup)

                if (!envs[key][2]) envs[key][2] = newKey

                newEnvs[newKey] = envs[key]
                delete envs[key]
            }
        }
        else {
            for (const key in envs) { if (!envs[key]![2]) { envs[key]![2] = key } }
        }

        const completeEnvs = envs as {
            [K in keyof TEnvsD]: TEnvsD[K] extends infer R
            ? R extends ClientEnvItem ? ['client', TEnvsD[K][1], string]
            : R extends ServerEnvItem ? ['server', TEnvsD[K][1], string]
            : R extends SharedEnvItem ? ['shared', TEnvsD[K][1], string]
            : never
            : never
        }

        // const completeEnvs = envs

        return new DynamicTsEnv(completeEnvs, config, prefixLookup)
    }

    private rawLookupContainer(isServer: boolean) {
        return isServer
            ? (globalThis as unknown as CustomLookupContainer)
            : (globalThis as unknown as CustomLookupContainer)
    }

    private rawLookup(isServer: boolean, type: EnvTypes, processEnvKey: string) {
        // console.log("LOOKUP CONTAINER SERVER", isServer, this.rawLookupContainer(true)?.[DynamicTsEnv.LOOKUP_KEY])
        // console.log("LOOKUP CONTAINER CLIENT", isServer, this.rawLookupContainer(false)?.[DynamicTsEnv.LOOKUP_KEY])
        return (
            this.rawLookupContainer(isServer)[DynamicTsEnv.LOOKUP_KEY]?.[type]?.[processEnvKey] ??
            globalThis?.process?.env?.[processEnvKey] ??
            process?.env?.[processEnvKey]
        )
    }

    private initRawServerLookup() {

        const container = globalThis as unknown as CustomLookupContainer
        if (!container) { throw Error('Missing Server Global Lookup Container: globalThis') }

        let lookup = container?.[DynamicTsEnv.LOOKUP_KEY]
        if (typeof lookup === 'undefined') {
            container[DynamicTsEnv.LOOKUP_KEY] = JSON.parse(JSON.stringify(this.rawEnvs)) as CustomLookup
            lookup = container[DynamicTsEnv.LOOKUP_KEY]!
        }

        return lookup
    }

    resolve() {

        // console.log('\n\n\nBUILD STATIC', this.type, this.prefix, this.parsedEnvs)

        const isServer = this.serverCheck()

        if (isServer) {

            const rawLookup = this.initRawServerLookup()

            for (const key in this.envs) {

                const [type, schema, processEnvKey] = this.envs[key]!

                const rawValue = process.env[processEnvKey]
                const parser = schema.safeParse(rawValue)
                if (!parser.success) { this.onValidationError({ key, processEnvKey, parser }) }

                this.rawEnvs[type][key] = rawValue as typeof this.rawEnvs[typeof type][typeof key]
                this.parsedEnvs[type][key] = parser.data
                rawLookup[type][key] = rawValue
            }
        }

        this.type = 'static'
        this.staticEnvsPopulated = true

        return this
    }


    injectShareableEnvsIntoLookup(shareableLookup: CustomLookup) {

        if (this.type !== 'static') { throw Error(`Cannot populateStaticOnClient() on a dynamic env config, use resolve() first`) }

        if (!this.serverCheck()) { throw Error(`Cannot use injectShareableEnvsIntoLookup on the client`) }

        for (const key in this.rawEnvs.client) {
            shareableLookup['client'][key] = this.rawEnvs.client[key]
        }

        for (const key in this.rawEnvs.shared) {
            shareableLookup['shared'][key] = this.rawEnvs.shared[key]
        }

        this.injectShareableEnvs = true
    }

    prefixedEnvKey<TKey extends keyof TEnvs & string>(key: TKey): TKey {
        return (this.prefix ? this.prefixLookup![key] : key) as TKey
    }

    get<
        TKey extends (keyof TEnvs & string)
    >(
        rawKey: TKey
    ): ReturnType<TEnvs[TKey][1]['parse']> {

        const isServer = this.serverCheck()

        const key = this.prefixedEnvKey(rawKey)

        const [type, schema, processEnvKey] = this.envs[key]!

        if (type === 'server' && !isServer) { this.onServerError({ key, processEnvKey, type }) }

        if (this.type === 'static') {
            const value = this.parsedEnvs[type][key]
            if (typeof value !== 'undefined') { return value }
        }

        const rawValue = this.rawLookup(isServer, type, processEnvKey)
        const parser = schema.safeParse(rawValue)
        if (!parser.success) { this.onValidationError({ key, processEnvKey, parser }) }

        return parser.data
    }
}

export type { DynamicTsEnv }

export const createDynamicEnv = DynamicTsEnv.buildDynamic.bind(DynamicTsEnv)
export const createStaticEnv = DynamicTsEnv.buildStatic.bind(DynamicTsEnv)

export const createEnvTemplate = <
    const TEnvs extends Envs,
    const TConfig extends Omit<Config, 'prefix'>
>(
    envs: {
        [K in keyof TEnvs]: K extends ClientKey ? EnforceClientType<TEnvs[K]> : EnforceServerType<TEnvs[K]> | EnforceSharedType<TEnvs[K]>
    },
    config?: TConfig
) => <TPrefix extends string>(prefix: TPrefix) => DynamicTsEnv.buildDynamic(envs, { ...config, prefix })

export const isAllowedEnvItem = (item: unknown): item is AllowedEnvItem => {
    return (
        typeof item === 'object' &&
        item !== null &&
        (item as AllowedEnvItem).__ID === 'GLOBAL_TS_ENV'
    )
}


export type AllowedEnvItem = 
    | ReturnType<typeof createDynamicEnv> 
    | ReturnType<typeof createStaticEnv>


export type EnvConfig = Record<string, AllowedEnvItem | Record<string, AllowedEnvItem>>

export const createEnv = <const TEnv extends EnvConfig>(env: TEnv) => env

