
// import type { NextRequest } from "next/server"

type ValidateSanityStudioRequestResult = { valid: boolean, missing?: boolean }

export function validateSanityStudioRequest(req: Request, studioSecretsApiToken: string): ValidateSanityStudioRequestResult {

    const reqToken = req.headers.get("authorization")?.replace(/^Bearer /, "")

    if (!reqToken) { return { valid: false, missing: true } }

    if (reqToken !== studioSecretsApiToken) { return { valid: false } }

    return { valid: true }
}