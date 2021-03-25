import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'

import { PostCard } from '@components/PostCard'

import { PostWithSub, TopSub } from '@tps/data.types'
import { useAuthState } from '@context/auth.context'
import { useEffect, useState } from 'react'
import { useInfiniteScroll } from '@hooks/useInfiniteScroll'
import axios from 'axios'
import { ServerResponse } from '@tps/api.types'


const description = 'Reddit is a network of communities based on people\'s interests. Find communities you\'re interested in, and become part of an online community!'
const title = 'reddit: the front page of the internet'

export default function HomePage() {
    const { authenticated } = useAuthState()

    const [posts, setPosts] = useState<PostWithSub[]>([])
    const [page, setPage] = useState(1)
    const limit = 10

    const { data: topSubs } = useSWR<TopSub[]>('/misc/top-subs')

    const fetchPosts = async () => {
        try {
            const response = await axios.get<ServerResponse<PostWithSub[]>>(`/posts/?page=${page}&limit=${limit}`)

            if (response.data.status === 'success') {
                if (!response.data.data.length) {
                    return
                }
                const newPosts = response.data.data
                setPosts((prev) => [...prev, ...newPosts])
                setPage((page) => page + 1)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const changePostVote = (id: string, vote: number) => {
        const newPosts: PostWithSub[] = posts.map((post) => post.identifier === id ? {
            ...post, voteScore: post.voteScore + vote, userVote: vote,
        } : post)
        setPosts(newPosts)
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const infiniteScrollRef = useInfiniteScroll<HTMLInputElement>(fetchPosts, posts.length)

    return (<>
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="og:description" content={description} />
            <meta name="og:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:title" content={title} />
        </Head>

        <div
            ref={infiniteScrollRef}
            className="flex pt-4 w-full justify-center"
            style={{ maxHeight: 'calc(100vh - 3rem)', height: '100%', overflowY: 'auto' }}
        >
            {/* Posts feed */}
            <div className="w-full md:w-160 px-2 md:px-0">
                {posts.map((post) => (<PostCard key={post.identifier} post={post} changeVote={changePostVote}/>))}
                <div style={{ height: 20 }}/>
            </div>

            {/* Sidebar */}
            <div className="hidden md:block ml-6 w-80">
                <div className="bg-white rounded">
                    <div className="p-4 border-b-2">
                        <p className="text-lg font-semibold text-center">Top Communities</p>
                    </div>
                    <div>
                        {topSubs?.map((sub: TopSub) => (
                            <div key={sub.name} className="flex items-center px-4 py-2 text-xs border-b">
                                <div className="mr-2 overflow-hidden cursor-pointer">
                                    <Link href={`/r/${sub.name}`}>
                                        <a>
                                            <Image
                                                src={sub.imageUrl}
                                                className="rounded-full"
                                                alt={`${sub.name} sub avatar`}
                                                width={(6 * 16) / 4}
                                                height={(6 * 16) / 4}
                                            />
                                        </a>
                                    </Link>
                                </div>
                                <Link href={`/r/${sub.name}`}>
                                    <a className="font-bold hover:cursor-pointer">/r/{sub.name}</a>
                                </Link>
                                <p className="ml-auto font-med">{sub.postCount}</p>
                            </div>))}
                    </div>
                    {!authenticated ? null : (<div className="p-4 border-t-2">
                        <Link href="/subs/create">
                            <a className="w-full blue button px-2 py-1">Create Community</a>
                        </Link>
                    </div>)}
                </div>
            </div>
        </div>
    </>)
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   try {
//     const { data } = await axios.get<IResponse<Post[]>>('/posts')
//     return { props: { posts: data.data } }
//   } catch (err) {
//     console.log(err.response.data)
//     return { props: { error: err.response.data } }
//   }
// }
