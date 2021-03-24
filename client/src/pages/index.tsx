import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'

import { PostCard } from '@components/PostCard'

import { Post, TopSub } from '@tps/data.types'
import { useAuthState } from '@context/auth.context'
import { useRef, useState } from 'react'
import { useScroll } from '@hooks/useScroll'
import axios from 'axios'
import { ServerResponse } from '@tps/api.types'


export default function HomePage() {
    const { authenticated } = useAuthState()

    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const limit = 10
    const parentRef = useRef()
    const childRef = useRef()

    const { data: topSubs } = useSWR<TopSub[]>('/misc/top-subs')




    const fetchPosts = async (page, limit) => {
        try {
            const res = await axios.get<ServerResponse<Post[]>>(`/posts/?page=${page}&limit=${limit}`)
            console.log(res)

            if (res.data.status === 'success') {
                if(!res.data.data.length) {
                    return
                }
                const newPosts = res.data.data
                setPosts(prev => [...prev, ...newPosts])
                setPage(page => page + 1)
            }

        } catch (err) {
            console.log(err)
        }
    }

    useScroll(parentRef, childRef, () => fetchPosts(page, limit))

    return (
        <>
            <Head>
                <title>reddit: the front page of the internet</title>
            </Head>

            <div ref={parentRef} className="flex pt-4 w-full justify-center" style={{maxHeight: 'calc(100vh - 3rem)', height: '100%', overflowY: 'auto'}} >
                {/* Posts feed */}
                <div className="w-full md:w-160 px-2 md:px-0">
                    {posts.map((post) => (
                        <PostCard key={post.identifier} post={post} />
                    ))}
                    <div ref={childRef} style={{height: 20, backgroundColor: 'green'}}/>
                </div>

                {/* Sidebar */}
                <div className="hidden md:block ml-6 w-80">
                    <div className="bg-white rounded">
                        <div className="p-4 border-b-2">
                            <p className="text-lg font-semibold text-center">
                                Top Communities
                            </p>
                        </div>
                        <div>
                            {topSubs?.map((sub: TopSub) => (
                                <div
                                    key={sub.name}
                                    className="flex items-center px-4 py-2 text-xs border-b"
                                >
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
                                        <a className="font-bold hover:cursor-pointer">
                                            /r/{sub.name}
                                        </a>
                                    </Link>
                                    <p className="ml-auto font-med">{sub.postCount}</p>
                                </div>
                            ))}
                        </div>
                        {!authenticated ? null : (
                            <div className="p-4 border-t-2">
                                <Link href='/subs/create'>
                                    <a className="w-full blue button px-2 py-1">
                                        Create Community
                                    </a>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </>
    )
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
