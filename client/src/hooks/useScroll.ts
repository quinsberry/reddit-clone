import { useEffect, useRef } from "react"

export const useScroll = (parentRef, childRef, callback): void => {

    const observer = useRef<IntersectionObserver>()

    useEffect(() => {
        const options = {
            root: parentRef.current,
            rootMargin: '0px',
            threshold: 0
        }
        observer.current = new IntersectionObserver(([target]) => {
            if (target.isIntersecting) {
                callback()
            }
        }, options)

        observer.current.observe(childRef.current)

        return () => {
            observer.current.unobserve(childRef.current)
        }

    }, [callback])
}
