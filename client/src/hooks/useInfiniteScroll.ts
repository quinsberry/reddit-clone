import { useEffect, useRef, useState } from 'react'


export const useInfiniteScroll = <RefType extends HTMLDivElement>(callback: () => void, trigger: any) => {
    const [canScroll, setCanScroll] = useState(true)
    const containerRef = useRef<RefType>()

    useEffect(() => {
        const container = containerRef.current

        const handleScroll = () => {
            if (canScroll && container.scrollTop === container.scrollHeight - container.offsetHeight) {
                callback()
                setCanScroll(false)
            }
        }

        if (container) container.addEventListener('scroll', handleScroll)

        return () => {
            if (container) container.removeEventListener('scroll', handleScroll)
        }
    }, [canScroll, callback])

    useEffect(() => {
        setCanScroll(true)
    }, [trigger])

    return containerRef
}
