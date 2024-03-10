import { createEnv } from "@repo/ts-env/next"
import { ENV_DYNAMIC__nextApp } from "@env/next-app"
import { ENV_DYNAMIC__vercel } from "@env/vercel"
import { ENV_DYNAMIC__devOnly } from "@env/dev-only"


export const env = createEnv({

    app: ENV_DYNAMIC__nextApp.resolve(),

    vercel: ENV_DYNAMIC__vercel.resolve(),

    devOnly: ENV_DYNAMIC__devOnly.resolve(),

})

