import { fetchGrecaptchaV3Result } from "."
import { grecaptchaV3TokenConfig } from "../../@common/config"

export { grecaptchaV3TokenConfig }

export async function isValidV3CaptchaScore(
    token: string, 
    validScroeThreshold: number = grecaptchaV3TokenConfig.defaultValidScoreThreshold
){

    const res = await fetchGrecaptchaV3Result(token)
    
    if(!res?.score || res.score < validScroeThreshold) return false
    return true

}