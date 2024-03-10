import { SetTheme } from "@demo/basic-theme/@gen/@client/components"
import { Home } from "@site/(home)/_files/home/__/client"



type PageProps = RC.PageProps
export default function Page({ params, searchParams }: PageProps) {
	return (
		<>
			<SetTheme />

			<Home />
		</>
	)
}

