"use client"

//packages
import { useEffect } from "react"
import { usePathname } from "next/navigation"

//repo

export function AppLayout__CLIENT(props: { children: React.ReactNode }) {
	const pathname = usePathname()

	useEffect(() => {
		if (!window.location.hash) {
			window.scrollTo(0, 0)
		}
	}, [pathname])

	return <>{props.children}</>
}
