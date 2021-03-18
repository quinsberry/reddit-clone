import React from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router'

import { PostCard } from '@components/PostCard'
import { Sub } from '@tps/data.types'


export default function SubPage() {
    const router = useRouter()

    const subName = router.query.sub

    const {data: sub, error } = useSWR<Sub>(subName ? `/subs/${subName}` : null)

    if (error) router.push('/')

    return (
        <div className="container flex pt-5">
            {!sub ? null : (
                <div className="w-160">
                    {sub.posts.map(post => <PostCard key={post.identifier} post={post}/>)}
                </div>
            )}
        </div>
    )
}