import { z } from "zod"


const tokenName = 'grecaptchaToken' as const
const tokenSchema = z.string()

export const grecaptchaV3TokenConfig = {
    tokenName,
    tokenSchema,
    schema: z.object({ [tokenName]: tokenSchema }),
    defaultValidScoreThreshold: 0.5,
} as const