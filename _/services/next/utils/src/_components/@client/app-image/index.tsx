"use client"

//packages
import { useState } from "react"
import NextImage from "next/image"

//lib
import { cn } from "@repo/css-utils/cn"

// app

//assets

//types
import type { ImageProps, StaticImageData } from "next/image"

export type AppImageElement = ReturnType<typeof AppImage>

export type Src = string
type BlurDataURL = ImageProps["blurDataURL"]
type AppBlurDataUrl<TSrc extends Src, TManual extends boolean|undefined> = TSrc extends string 
    ? TSrc extends `/${string}` 
        ?  { blurDataURL?: BlurDataURL } 
        : TManual extends true
            ? { blurDataURL?: BlurDataURL } 
            : { blurDataURL: string }
    : TManual extends true
    ? { blurDataURL?: BlurDataURL } 
    : { blurDataURL: string }

export type AppImageProps<TSrc extends Src, TManual extends boolean|undefined> = Omit<ImageProps, "src" | "blurDataURL" | "alt" | "placeholder"> & { src: TSrc, alt:string, manual?:TManual }  & AppBlurDataUrl<TSrc, TManual>
export function AppImage<TSrc extends Src, TManual extends boolean|undefined>({ src, alt, manual, blurDataURL, className, ...props }: AppImageProps<TSrc, TManual>) {
    
    const [isLoading, setLoading] = useState(true)

    return (
        <NextImage
            {...props}
            placeholder={"blur"}
            src={src}
            alt={alt}
            blurDataURL={blurDataURL}
            className={cn(
                'duration-500 ease-in-out object-cover overflow-hidden',
                isLoading
                    ? 'xgrayscale blur-2xl scale-110'
                    : 'xgrayscale-0 blur-0 scale-100'
                ,
                // props.fill ? '' : 'w-full h-full',
                className,
            )}
            onLoad={(...args) => {setLoading(false); props?.onLoad?.(...args) }}
        />
    )
}

