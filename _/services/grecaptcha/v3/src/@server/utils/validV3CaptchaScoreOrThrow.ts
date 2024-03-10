
import { isValidV3CaptchaScore } from "."

const defaultValidScroeThreshold = 0.5 as const
const defaultErrorMessage = 'captcha validation failed' as const

const defaulftOpts = {
    validScroeThreshold: defaultValidScroeThreshold,
    message: defaultErrorMessage
}

type validV3CaptchaScoreOrTrpcThrowOpts = {
    validScroeThreshold?:number,
    message?:string
}

export async function validV3CaptchaScoreOrTrpcThrow(
    token:string, 
    {
        validScroeThreshold=defaultValidScroeThreshold, 
        message=defaultErrorMessage
    }:validV3CaptchaScoreOrTrpcThrowOpts=defaulftOpts
){

    const isValid = await isValidV3CaptchaScore(token, validScroeThreshold)
    // if(!isValid) { throw new Error({ code: 'FORBIDDEN', message, cause:'grecaptcha-v3' }) }
    if(!isValid) { throw new Error(message) }

    return true

}