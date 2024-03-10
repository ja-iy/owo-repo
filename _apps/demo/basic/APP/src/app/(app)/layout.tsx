import { INIT__SERVER__AppVars } from "@repo/app-vars/init"

import { INIT__TwTheme } from "@demo/basic-theme/@gen/@client/init"

import { AppLayout__CLIENT } from "@app/_files/app-layout/__/client"

import "./_files/_styles/main.css"


export default function AppLayout(props: { children: React.ReactNode }) {
	return (
		<>
			<INIT__SERVER__AppVars MOBILE_WIDTH={900} />

			<INIT__TwTheme />

			<AppLayout__CLIENT>
				<div className="h-auto w-full overflow-x-hidden">
					<div
						id="modal"
						className="pointer-events-none fixed  left-0 top-0 z-[9000] h-screen w-screen"
					></div>

					<div className="relative z-[1]">{props.children}</div>
				</div>
			</AppLayout__CLIENT>
		</>
	)
}
