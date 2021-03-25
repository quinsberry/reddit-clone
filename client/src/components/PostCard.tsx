import { FC, ReactElement } from 'react'
import Link from 'next/link'
import axios from 'axios'
import cn from 'classnames'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { Post, PostWithSub } from '@tps/data.types'
import { useAuthState } from '@context/auth.context'
import { useRouter } from 'next/router'


dayjs.extend(relativeTime)

const ActionButton = ({ children }) => (
    <div className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">{children}</div>
)

interface PostCardProps {
    post: PostWithSub | Post

    changeVote?: (id: string, vote: number) => void
    revalidate?: () => Promise<any>
}

export const PostCard: FC<PostCardProps> = ({ post, changeVote, revalidate }): ReactElement => {
    // @ts-ignore
    const { identifier, slug, voteScore, userVote, subName, username, createdAt, url, title, body, commentCount, sub } = post


    const router = useRouter()
    const { authenticated } = useAuthState()

    const isInSubPage = router.pathname === '/r/[sub]'

    const vote = async (value: number) => {
        try {
            if (!authenticated) router.push('/login')
            await axios.post<PostWithSub>('/misc/vote', {
                identifier,
                slug,
                value,
            })

            if (changeVote) changeVote(post.identifier, value)
            else if (revalidate) revalidate()

        } catch (err) {
            console.log(err.response.data)
        }
    }
    return (
        <div className="flex mb-4 bg-white rounded">
            {/* Vote section */}
            <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
                <div
                    className={cn(
                        'w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500',
                        { 'cursor-auto': !authenticated }
                    )}
                    onClick={() => vote(1)}
                >
                    <i className={cn('icon-arrow-up', { 'text-red-500': userVote === 1 })} />
                </div>
                <p className="text-xs font-bold">{voteScore}</p>
                <div
                    className={cn(
                        'w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600',
                        { 'cursor-auto': !authenticated }
                    )}
                    onClick={() => vote(-1)}
                >
                    <i className={cn('icon-arrow-down', { 'text-blue-600': userVote === -1 })} />
                </div>
            </div>
            {/* Post data section */}
            <div className="w-full p-2">
                <div className="flex items-center">
                    {isInSubPage ? null : (
                        <>
                            <Link href={`/r/${subName}`}>
                                <img
                                    src={sub?.imageUrl}
                                    alt="pic"
                                    className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                                />
                            </Link>
                            <Link href={`/r/${subName}`}>
                                <a className="text-xs font-bold cursor-pointer hover:underline">/r/{subName}</a>
                            </Link>
                            <span className="mx-1 text-xs text-gray-500">•</span>
                        </>
                    )}
                    <p className="text-xs text-gray-500">
                        Posted by
                        <Link href={`/u/${username}`}>
                            <a className="mx-1 hover:underline">/u/{username}</a>
                        </Link>
                        <Link href={url}>
                            <a className="mx-1 hover:underline">{dayjs(createdAt).fromNow()}</a>
                        </Link>
                    </p>
                </div>
                <Link href={url}>
                    <a className="my-1 text-lg font-medium">{title}</a>
                </Link>
                {body && <p className="my-1 text-sm">{body}</p>}

                <div className="flex">
                    <Link href={url}>
                        <a>
                            <ActionButton>
                                <i className="mr-1 fas fa-comment-alt fa-xs" />
                                <span className="font-bold">{commentCount} Comments</span>
                            </ActionButton>
                        </a>
                    </Link>
                    <ActionButton>
                        <i className="mr-1 fa fa-share fa-xs" />
                        <span className="font-bold">Share</span>
                    </ActionButton>
                    <ActionButton>
                        <i className="mr-1 fa fa-bookmark fa-xs" />
                        <span className="font-bold">Save</span>
                    </ActionButton>
                </div>
            </div>
        </div>
    )
}
