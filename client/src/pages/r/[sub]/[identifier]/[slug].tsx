import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import cn from 'classnames'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Comment, PostWithSub, SubmittedCommentResponse } from '@tps/data.types'
import { useAuthState } from '@context/auth.context'
import axios from 'axios'
import { Sidebar } from '@components/Sidebar'
import { ActionButton } from '@components/common/ActionButton'
import { FormEvent, useMemo, useState } from 'react'


dayjs.extend(relativeTime)

export default function PostPage() {
    const router = useRouter()
    const { identifier, slug, sub } = router.query

    const { authenticated, user } = useAuthState()

    const [newComment, setNewComment] = useState('')

    const { data: post, error, revalidate: postRevalidation } = useSWR<PostWithSub>(
        identifier && slug ? `/posts/${identifier}/${slug}` : null
    )
    if (error) router.push('/')

    const { data: comments, revalidate: commentsRevalidation } = useSWR<Comment[]>(
        identifier && slug ? `/posts/${identifier}/${slug}/comments` : null
    )

    const seo = useMemo(() => {
        if (!post) return
        let desc = post.body || post.title
        if (desc.length > 160) {
            desc = desc.substring(0, 158).concat('..')
        }
        return {
            description: desc,
        }
    }, [post])

    const vote = async (value: number, comment?: Comment) => {
        // If not logged in go to login
        if (!authenticated) router.push('/login')

        // If vote is the same reset vote
        if ((!comment && value === post.userVote) || (comment && comment.userVote === value)) {
            value = 0
        }

        try {
            await axios.post<SubmittedCommentResponse>('/misc/vote', {
                identifier,
                slug,
                commentIdentifier: comment?.identifier,
                value,
            })

            postRevalidation()
            if (comment) {
                commentsRevalidation()
            }
        } catch (err) {
            console.log(err)
        }
    }

    const submitComment = async (event: FormEvent) => {
        event.preventDefault()
        if (newComment.trim() === '') return

        try {
            await axios.post(`/posts/${post.identifier}/${post.slug}/comments`, {
                body: newComment,
            })

            setNewComment('')

            commentsRevalidation()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Head>
                <title>{post?.title}</title>
                <meta name="description" content={seo?.description} />
                <meta name="og:description" content={seo?.description} />
                <meta name="og:title" content={post?.title} />
                <meta name="twitter:description" content={seo?.description} />
                <meta name="twitter:title" content={post?.title} />
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
                            <>
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
                                                <i className="mr-1 fas fa-bookmark fa-xs" />
                                                <span className="font-bold">Save</span>
                                            </ActionButton>
                                        </div>
                                    </div>
                                </div>
                                {/* Comment input area */}
                                <div className="pl-10 pr-6 mb-4">
                                    {authenticated ? (
                                        <div>
                                            <p className="mb-1 text-xs">
                                                Comment as{' '}
                                                <Link href={`/u/${user.username}`}>
                                                    <a className="font-semibold text-blue-500">{user.username}</a>
                                                </Link>
                                            </p>
                                            <form onSubmit={submitComment}>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    value={newComment}
                                                />
                                                <div className="flex justify-end">
                                                    <button
                                                        className="px-3 py-1 blue button disabled:curso"
                                                        disabled={newComment.trim() === ''}
                                                    >
                                                        Comment
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                                            <p className="font-semibold text-gray-400">
                                                Log in or sign up to leave a comment
                                            </p>
                                            <div>
                                                <Link href="/login">
                                                    <a className="px-4 py-1 mr-4 hollow blue button">Login</a>
                                                </Link>
                                                <Link href="/register">
                                                    <a className="px-4 py-1 blue button">Sign Up</a>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <hr />
                                {/* Comments feed */}
                                {comments?.map((comment) => (
                                    <div className="flex" key={comment.identifier}>
                                        {/* Vote section */}
                                        <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                                            {/* Upvote */}
                                            <div
                                                className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                                                onClick={() => vote(1, comment)}
                                            >
                                                <i
                                                    className={cn('icon-arrow-up', {
                                                        'text-red-500': comment.userVote === 1,
                                                    })}
                                                />
                                            </div>
                                            <p className="text-xs font-bold">{comment.voteScore}</p>
                                            {/* Downvote */}
                                            <div
                                                className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                                                onClick={() => vote(-1, comment)}
                                            >
                                                <i
                                                    className={cn('icon-arrow-down', {
                                                        'text-blue-600': comment.userVote === -1,
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className="py-2 pr-2">
                                            <p className="mb-1 text-xs leading-none">
                                                <Link href={`/u/${comment.username}`}>
                                                    <a className="mr-1 font-bold hover:underline">{comment.username}</a>
                                                </Link>
                                                <span className="text-gray-600">
                                                    {`
                            ${comment.voteScore}
                            points •
                            ${dayjs(comment.createdAt).fromNow()}
                          `}
                                                </span>
                                            </p>
                                            <p>{comment.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
                {/* Sidebar */}
                {post && <Sidebar sub={post.sub} />}
            </div>
        </>
    )
}
