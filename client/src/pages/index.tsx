import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'

import { PostCard } from '@components/PostCard'

import { Post, TopSub } from '@tps/data.types'


export default function Home() {
    const { data: posts } = useSWR<Post[]>('/posts')
    const { data: topSubs } = useSWR<TopSub[]>('/misc/top-subs')

    return (
        <>
            <Head>
                <title>reddit: the front page of the internet</title>
            </Head>

            <div className="container flex pt-4">
                {/* Posts feed */}
                <div className="w-160">
                    {posts?.map((post) => (
                        <PostCard key={post.identifier} post={post}/>
                    ))}
                </div>

                {/* Sidebar */}
                <div className="ml-6 w-80">
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
