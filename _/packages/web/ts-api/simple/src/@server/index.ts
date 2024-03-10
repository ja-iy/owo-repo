import { tsApiResult } from "./api-result"
import { validateTsApiRequest } from "./validate-request"

export * from "./api-result"
export * from "./validate-request"

export const TYPSAFE_API_CALLER_SERVER = {
    validateRequest: validateTsApiRequest,
    result: tsApiResult,
}

export const tacs = TYPSAFE_API_CALLER_SERVER