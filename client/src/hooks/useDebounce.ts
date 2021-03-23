import { useCallback, useRef } from 'react'

type Callback = (...args: any) => void

export const useDebounce = (callback: Callback, delay: number = 300): Callback => {

    const timer = useRef<number>()

    return useCallback((...args) => {

        if (timer.current) clearTimeout(timer.current)

        timer.current = setTimeout(() => {
            callback(...args)
        }, delay) as unknown as number

    }, [callback, delay])
}