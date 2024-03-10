
//types
import type { Metadata } from "next"

type NoIndexParams = { title:string, followLinks?:boolean }
export function metaNoIndex({
    title, 
    followLinks=false
}:NoIndexParams):Metadata{
   
    return {
        title: title,
        robots: `noindex${followLinks ? '':', nofollow'}`,
    }
}
