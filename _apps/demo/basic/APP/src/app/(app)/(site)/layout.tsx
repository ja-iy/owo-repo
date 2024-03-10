import { SiteLayout__CLIENT } from "@site/_files/site-layout/__/client"
import { SiteNav } from "@site/_files/site-layout/site-nav/__/server"

import { SITE_CONFIG } from "@/config/site-config"

const domain = SITE_CONFIG.site.domain

type LayoutProps = RC.LayoutProps
export default function AppLayout({ children }: LayoutProps) {
	return (
		<SiteLayout__CLIENT>
			<SiteNav
				items={[
					{ label: "Site", href: domain },
					{ label: "Features", href: `${domain}/features` },
					{ label: "Docs", href: `${domain}/docs` },
					{ label: "News", href: `${domain}/news` },
				]}
			/>

			<div className={`min-h-screen w-full text-foreground`}>
				<div className={`w-full flex-1 `}>{children}</div>
			</div>
		</SiteLayout__CLIENT>
	)
}
