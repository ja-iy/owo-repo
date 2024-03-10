import { env } from "../../env.mjs"

export async function fetchGrecaptchaV3Result(gReCaptchaToken:string){


    try{
        const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `secret=${env.grecaptchaV3.get('RECAPTCHA_SECRET_KEY')}&response=${gReCaptchaToken}`,
        })
        if (!res.ok) { throw new Error("Failed to verify grecaptcha", { cause: res.status }) }
        const data = await res.json()
        // if(env.vercel.get('VERCEL_ENV') && env.app.get('NEXT_PUBLIC_MODE')) console.log("grecaptchaV3 fetched data:", data)
        return data as { score:number }
    }

    catch(err){

        console.log("ERROR fetching grecapthcaV3", err)

        if (err instanceof Error && typeof err.cause === "number"){
            switch (err?.cause){
                case 400: { throw new Error("Bad request", { cause: err.cause }); break }
                case 401: { throw new Error("Unauthorized", { cause: err.cause }); break }
                case 403: { throw new Error("Forbidden", { cause: err.cause }); break }
                case 404: { throw new Error("Not found", { cause: err.cause }); break }
                case 405: { throw new Error("Method not allowed", { cause: err.cause }); break }
                case 406: { throw new Error("Not acceptable", { cause: err.cause }); break }
                case 429: { throw new Error("Too many requests", { cause: err.cause }); break }
                case 500: { throw new Error("Internal server error", { cause: err.cause }); break }
                case 503: { throw new Error("Service unavailable", { cause: err.cause }); break }
                default: { throw new Error("Unknown error", { cause: err.cause }); break }
            }
        }
        else {
            throw err
        }
    }
    
}