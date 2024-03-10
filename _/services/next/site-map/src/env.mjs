import { ENV_DYNAMIC__nextApp } from "@env/next-app"
import { ENV_DYNAMIC__vercel } from "@env/vercel"
import { ENV_DYNAMIC__devOnly } from "@env/dev-only"

export const env = {
    app: ENV_DYNAMIC__nextApp,
    vercel: ENV_DYNAMIC__vercel,
    devOnly: ENV_DYNAMIC__devOnly,
}