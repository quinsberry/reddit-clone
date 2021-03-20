import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import cn from 'classnames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Post } from '@tps/data.types'
import { useAuthState } from '@context/auth.context'
import axios from 'axios'
import { Sidebar } from '@components/Sidebar'
import { ActionButton } from '@components/common/ActionButton'

dayjs.extend(relativeTime)


export default function PostPage() {
    const router = useRouter()
    const { identifier, slug, sub } = router.query

    const { authenticated } = useAuthState()

    const { data: post, error, revalidate } = useSWR<Post>(identifier && slug ? `/posts/${identifier}/${slug}` : null)
    if (error) router.push('/')

    const vote = async (value: number) => {
        // If not logged in go to login
        if (!authenticated) router.push('/login')

        // If vote is the same reset vote
        if (value === post.userVote) value = 0

        try {
            await axios.post('/misc/vote', {
                identifier,
                slug,
                value,
            })

            revalidate()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Head>
                <title>{post?.title}</title>
            </Head>
            <Link href={`/r/${sub}`}>
                <a>
                    <div className="flex items-center w-full h-20 p-8 bg-blue-500">
                        <div className="container flex">
                            {post && (
                                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                                    <Image src={post.sub.imageUrl} height={(8 * 16) / 4} width={(8 * 16) / 4} />
                                </div>
                            )}
                            <p className="text-xl font-semibold text-white">/r/{sub}</p>
                        </div>
                    </div>
                </a>
            </Link>
            <div className="container flex pt-5">
                {/* Post */}
                <div className="w-160">
                    <div className="bg-white rounded">
                        {post && (
                            <div className="flex">
                                {/* Vote section */}
                                <div className="w-10 py-3 pl-1 text-center rounded-l">
                                    {/* Upvote */}
                                    <div
                                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                                        onClick={() => vote(1)}
                                    >
                                        <i
                                            className={cn('icon-arrow-up', {
                                                'text-red-500': post.userVote === 1,
                                            })}
                                        />
                                    </div>
                                    <p className="text-xs font-bold">{post.voteScore}</p>
                                    {/* Downvote */}
                                    <div
                                        className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                                        onClick={() => vote(-1)}
                                    >
                                        <i
                                            className={cn('icon-arrow-down', {
                                                'text-blue-600': post.userVote === -1,
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="p-2">
                                    <div className="flex items-center">
                                        <p className="text-xs text-gray-500">
                                            Posted by
                                            <Link href={`/u/${post.username}`}>
                                                <a className="mx-1 hover:underline">/u/{post.username}</a>
                                            </Link>
                                            <Link href={post.url}>
                                                <a className="mx-1 hover:underline">
                                                    {dayjs(post.createdAt).fromNow() ?? dayjs(post.createdAt)}
                                                </a>
                                            </Link>
                                        </p>
                                    </div>
                                    {/* Post title */}
                                    <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                                    {/* Post body */}
                                    <p className="my-3 text-sm">{post.body}</p>
                                    {/* Actions */}
                                    <div className="flex">
                                        <Link href={post.url}>
                                            <a>
                                                <ActionButton>
                                                    <i className="mr-1 fas fa-comment-alt fa-xs" />
                                                    <span className="font-bold">{post.commentCount} Comments</span>
                                                </ActionButton>
                                            </a>
                                        </Link>
                                        <ActionButton>
                                            <i className="mr-1 fas fa-share fa-xs" />
                                            <span className="font-bold">Share</span>
                                        </ActionButton>
                                        <ActionButton>
                                            <i className="mr-1 fas fa-bookmark fa-xs"/>
                                            <span className="font-bold">Save</span>
                                        </ActionButton>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {/* Sidebar */}
                {post && <Sidebar sub={post.sub} />}
            </div>
        </>
    )
}