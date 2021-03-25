import { useEffect, useRef, useState } from 'react'


export const useInfiniteScroll = <RefType extends HTMLDivElement>(fetch, length) => {
    const [canScroll, setCanScroll] = useState(true)
    const containerRef = useRef<RefType>()

    useEffect(() => {
        const container = containerRef.current

        const handleScroll = () => {
            if (canScroll && container.scrollTop === container.scrollHeight - container.offsetHeight) {
                fetch()
                setCanScroll(false)
            }
        }

        if (container) container.addEventListener('scroll', handleScroll)

        return () => {
            if (container) container.removeEventListener('scroll', handleScroll)
        }
    }, [canScroll, fetch])

    useEffect(() => {
        setCanScroll(true)
    }, [length])

    return containerRef
}
