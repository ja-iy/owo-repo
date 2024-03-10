import type { NextConfig } from "next"


export function createHeaders(headers:NonNullable<NextConfig["headers"]>) {

    return headers
}


export function createHeaderItems(creator:(input:{csp:string}) => Awaited<ReturnType<NonNullable<NextConfig["headers"]>>>[number]['headers']) {

    return creator
}


