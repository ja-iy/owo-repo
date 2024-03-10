"use client"

import { useEffect, useState } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { cn } from "@repo/css-utils/cn"
import { useDarkMode } from "@repo/tw-theme/@client"

import type { ButtonVariants } from "@repo-ui/shadcn/button"


type DarkModeToggleProps = {
	variant?: ButtonVariants["variant"]
	buttonClassName?: string
	containerClassName?: string
	iconClassName?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">
export function DarkModeToggleButton({ variant, containerClassName, iconClassName, buttonClassName, ...props }: DarkModeToggleProps) {
	const [mounted, setMounted] = useState(false)
	useEffect(() => {
		setMounted(true)
	}, [])

	const [darkMode, setDarkMode] = useDarkMode()

	return (
		<button
			aria-label="Toggle Dark Mode"
			{...props}
			className={cn(
				`aspect-sqaure flex h-full w-fit items-center justify-center rounded-md border border-foreground/25 focus-visible:border-foreground disabled:pointer-events-none disabled:opacity-50`,
				buttonClassName,
			)}
			onClick={() => {
				setDarkMode((v) => !v)
			}}
		>
			<div
				className={cn(
					`aspect-square h-full p-0`,
					containerClassName,
				)}
			>
				{mounted ? (
					darkMode ? (
						<MoonIcon
							className={cn(
								"aspect-square h-full fill-foreground",
								iconClassName,
							)}
						/>
					) : (
						<SunIcon
							className={cn(
								"aspect-square h-full",
								iconClassName,
							)}
						/>
					)
				) : (
					<div
						className={cn("aspect-square h-full", iconClassName)}
					/>
				)}

				<span className="sr-only">{"Toggle Dark Mode"}</span>
			</div>
		</button>
	)
}
