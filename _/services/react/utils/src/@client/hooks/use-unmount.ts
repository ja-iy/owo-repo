/*
    Takes a function and function arguments and calls the function when the component unmounts
*/

import { useRef, useEffect } from 'react'

type UseUnmoutCallback<T> = (arg: T) => void

export function useUnmount<T>(func: UseUnmoutCallback<T>, deps: T) {

    const funcRef = useRef(func)
    const depsRef = useRef(deps)

    funcRef.current = func
    depsRef.current = deps

    useEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
        return () => { funcRef.current(depsRef.current) }
    }, [])

}