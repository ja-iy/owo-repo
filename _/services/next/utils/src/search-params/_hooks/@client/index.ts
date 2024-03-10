"use client"

import { useEffect, useState } from "react"
// import { useSearchParams } from "next/navigation"

//types
import type { z } from "zod"


import { parseSearchParams } from "../../parse"
import type { ReadonlyURLSearchParams } from "next/navigation"

export function useParsedSearchParams<
    TSearchParamsSchema extends z.ZodTypeAny //NEEDS-FIX: this should be a zod object whose values are searchParamHelpers return types
>(
    searchParamsSchema: TSearchParamsSchema,
) {
    const urlSearchParams = useSearchParams()
    const rawSearchParams = urlSearchParams?.toString()
    if (!rawSearchParams) return parseSearchParams('', searchParamsSchema)
    return parseSearchParams(rawSearchParams, searchParamsSchema)
}


export function useSearchParams(): URLSearchParams {


    const [searchParams, setSearchParams] = useState('')

    useEffect(() => {

        // Function to extract search parameters from URL
        const getSearchParams = () => {
            const search = window.location.search
            setSearchParams(search)
        }

        // Call the function to get initial search parameters
        getSearchParams()

        // Add event listener to update search parameters on URL change
        window.addEventListener('popstate', getSearchParams)

        // Cleanup function to remove event listener when component unmounts
        return () => {
            window.removeEventListener('popstate', getSearchParams)
        }

    }, [])

    return new URLSearchParams(searchParams)

}