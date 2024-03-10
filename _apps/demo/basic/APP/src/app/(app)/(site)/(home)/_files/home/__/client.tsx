// this component curently requires no client interactivity, uncomment when you need to
// "use client"

import Image from "next/image"
import { images_home___example_bg_jpeg as bgImage } from "~/@gen/gen-image"


type HomeProps = {
	data?: never
}

export function Home(props: HomeProps) {
	return (
		<main className={ `relative min-h-screen w-full` }>
			<Landing />
			<Bg />
		</main>
	)
}

function Landing() {
	return (
		<div className="relative z-[10] flex min-h-screen w-full flex-col items-center justify-center px-4 ">

			<h1 className={ `w-fit text-center font-heading text-6xl  font-black` } >
				OwO Repo
			</h1>

			<p className="mt-8 rounded-md border border-foreground/25 px-4 py-2 text-center">
				An opinionated feature rich foundation for a typescript mono-repo
			</p>

		</div>
	)
}

function Bg() {
	return (
		<div className="fixed left-0 top-0 z-[-1] h-screen w-full opacity-[12%] animate-in fade-in-5 duration-1000 transition-opacity dark:opacity-[2%]">
			<div className='relative w-full h-full'>
				<Image
					fill
					className="object-cover"
					src={ bgImage.opt.jpeg.path }
					alt="bg"
					blurDataURL={ bgImage.lqip }
				/>
			</div>
		</div>
	)
}
