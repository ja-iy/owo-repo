import './src/env.mjs'
import { NEXT_CONFIG_HEADERS } from './next.config.headers.mjs'

import withBundleAnalyzer from '@next/bundle-analyzer' 


/** @type {import('next').NextConfig} */
export default defineNextConfig({

    transpilePackages: [ ],

    
    reactStrictMode: true,
    swcMinify: true,


    experimental: {
        nextScriptWorkers: true, //enable for partytown ( google analytics, ... )
        webpackBuildWorker: true,
    },


    rewrites: async () =>{
        return [
            { 
                source: '/sitemap.xml', 
                destination: '/api/sitemap'
            },
        ]
    },


    i18n:  {
        locales: ['en'],
        defaultLocale: 'en',
    },


    images: { 
        remotePatterns: [
            // {
            //     protocol: 'https',
            //     hostname: 'cdn.sanity.io',
            //     pathname: '/**',
            //     port: '',
            // },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '/**',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                pathname: '/**',
                port: '',
            }
        ],
    },


    headers: NEXT_CONFIG_HEADERS,
    
})


/**
 * @template {import('next').NextConfig} T
 * @param {T} config 
 * @constraint {{import('next').NextConfig}}
*/
function defineNextConfig(config) {

    if (process.env?.ANALYZE === 'true') {
        return withBundleAnalyzer({enabled: true})(config)
    }

    return config
}