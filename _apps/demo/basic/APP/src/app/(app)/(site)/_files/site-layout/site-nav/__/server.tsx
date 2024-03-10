import { DarkModeToggleButton } from "@site/_files/_components/@client/darkmode/toggle-button"
import { VscGithubInverted as GithubIcon } from "react-icons/vsc"

type SiteNavProps = {
	items: NavItemProps[]
}
export function SiteNav(props: SiteNavProps) {
	return (
		<header
			className={`item-center  pointer-events-auto fixed top-0 z-[40] mt-6 flex w-full flex-wrap justify-center gap-4 px-4 py-4`}
		>
			{props.items.map((item) => (
				<ExternalNavItem {...item} key={item.label} />
			))}

			<a
				href="https://github.com/ja-iy/owo-repo"
				target="_blank"
				rel="noreferrer"
				className="aspect-square h-[40px] w-[40px] rounded-md border border-foreground/25 p-[10px] opacity-75 duration-300 hover:bg-foreground/5  hover:opacity-100 focus-visible:border-foreground focus-visible:outline-0 focus-visible:ring-0"
			>
				<GithubIcon className="aspect-square w-full" />
			</a>

			<DarkModeToggleButton
				buttonClassName="h-[40px] w-[40px] rounded-md border border-foreground/25  p-[10px] opacity-75 duration-300 hover:bg-foreground/5 hover:opacity-100 focus-visible:border-foreground focus-visible:outline-0 focus-visible:ring-0 dark:p-[12px]"
				iconClassName="aspect-square w-full h-full"
			/>
		</header>
	)
}

type NavItemProps = {
	href: string
	label: string
}
function ExternalNavItem(props: NavItemProps) {
	return (
		<a
			href={
				props.href.startsWith(`https://`)
					? props.href
					: `https://${props.href}`
			}
			target="_blank"
			rel="noreferrer"
			className="h-fit rounded-md border border-foreground/25 px-4  py-[9px]  font-heading text-sm font-[500] opacity-75 duration-300  hover:bg-foreground/5 hover:opacity-100 focus-visible:border-foreground focus-visible:outline-0 focus-visible:ring-0"
		>
			{props.label}
		</a>
	)
}
