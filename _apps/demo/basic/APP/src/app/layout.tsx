import { metaBuilder } from "@repo/next-utils/@server/meta-builder"
import { INIT__SERVER__DynamicTsEnv } from "@repo/ts-env/next-init/@server"
import { getSiteUrl } from "@repo/next-utils/site-url"
import { cn } from "@repo/css-utils/cn"

import { BlockingDarkModeInit } from "@demo/basic-theme/@gen/blocking-dark-mode-init"

import { env } from "@/env.mjs"
import { fontVars } from "./(app)/_files/fonts.@S"

import type { Metadata } from "next"



type LayoutProps = RC.LayoutProps
export default function Layout(props: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={cn(`dark w-full overflow-x-hidden`, fontVars)}
			suppressHydrationWarning
		>

			<BlockingDarkModeInit />

			<body data-overlayscrollbars-initialize>
				<INIT__SERVER__DynamicTsEnv config={env} />

				{props.children}
			</body>
			
		</html>
	)
}



// METADATA
export const generateMetadata = metaBuilder<LayoutProps>(async (builder, errors, { params }, parent) => {


    const title = 'OwO Repo'
    const description = 'An opinionated feature rich foundation for a typescript mono-repo.'

    return {

        metadataBase: new URL(getSiteUrl()),

        title: {
            template: `%s | ${ title }`,
            default: title,
            absolute: title,
        },

        description,

        icons: [
            {
                rel: 'icon',
                type: 'image/svg+xml',
                url: '/icons/icon.svg',
			}
        ] satisfies Metadata['icons']

    }
})({
    routePath: '/',
})
