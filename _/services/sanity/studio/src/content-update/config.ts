import { z } from 'zod'


const namespace = 'contentUpdateApi' as const

export const SANITY_STUDIO_CONTENT_UPDATE_CONFIG = {
    namespace: namespace,
    documentId: `secrets.${namespace}`,
} as const

export const sanityStudioSecrets_contentUpadateValidation = z.object({
    contentUpdateApiToken: z.string().min(1),
})

export type SanityStudioSecrets_ContentUpdate = z.infer<typeof sanityStudioSecrets_contentUpadateValidation>