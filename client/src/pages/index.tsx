import { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'

import { PostCard } from '@components/PostCard'

import { IPost } from '@types/data.types'
import { IResponse } from '@types/api.types'

export default function Home() {
  const [posts, setPosts] = useState<IPost[]>([])
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get<IResponse<IPost[]>>('/posts')
        setPosts(data.data)
      } catch (err) {
        console.log(err.response.data)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="pt-12">
      <Head>
        <title>reddit: the front page of the internet</title>
      </Head>

      <div className="container flex pt-4">
        {/* Posts feed */}
        <div className="w-160">
          {posts.map((post) => (
            <PostCard key={post.identifier} post={post} />
          ))}
        </div>

        {/* Sidebar */}
      </div>
    </div>
  )
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   try {
//     const { data } = await axios.get<IResponse<IPost[]>>('/posts')
//     return { props: { posts: data.data } }
//   } catch (err) {
//     console.log(err.response.data)
//     return { props: { error: err.response.data } }
//   }
// }
