import Head from 'next/head'
import useSWR from 'swr'

import { PostCard } from '@components/PostCard'

import { Post } from '@tps/data.types'


export default function Home() {
    const { data: posts } = useSWR<Post[]>('/posts')

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
