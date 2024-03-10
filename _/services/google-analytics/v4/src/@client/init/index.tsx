"use client"

import { env } from '../../env.mjs'
import Script from 'next/script'

export default function GoogleAnalytics(){

    const id = env.googleAnalyticsV4.get('NEXT_PUBLIC_GOOGLE_ANALYTICS_ID')
    return <>
    
        <Script 
            src={`https://www.googletagmanager.com/gtag/js?id=${id}`} 
            strategy={'worker'}
        />

        <Script 
            id={'google-analytics-id'} 
            strategy={'worker'}
        >
            {` window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${id}');`}
        </Script>

    </>
}