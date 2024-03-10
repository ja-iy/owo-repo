// ts-reset & ts-globals
import '@repo/ts-globals'


// next server
import type { NextRequest, NextResponse } from 'next/server'
declare global {
    declare type NextRequest = InstanceType<typeof NextRequest>
    declare type NextResponse = InstanceType<typeof NextResponse>
}


// route props
import type * as RC from "@repo/next-utils/route-types"
declare global {
    declare namespace RC { export * from "@repo/next-utils/route-types" }
}



export type { } 
