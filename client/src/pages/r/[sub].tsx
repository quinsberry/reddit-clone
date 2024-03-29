import React, { ChangeEvent, createRef, useEffect, useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import cn from 'classnames'

import { PostCard } from '@components/PostCard'
import { Sub, SubWithPosts } from '@tps/data.types'
import { useAuthState } from '@context/auth.context'
import axios from 'axios'
import { Sidebar } from '@components/Sidebar'


export default function SubPage() {
    const router = useRouter()

    const fileInputRef = createRef<HTMLInputElement>()
    const [ownSub, setOwnSub] = useState(false)
    const { authenticated, user } = useAuthState()

    const subName = router.query.sub
    const { data: sub, error, revalidate } = useSWR<SubWithPosts>(subName ? `/subs/${subName}` : null)

    useEffect(() => {
        if (!sub) return
        setOwnSub(authenticated && user.username === sub.username)
    }, [sub])

    const openFileInput = (type: string): void => {
        if (!ownSub) return

        fileInputRef.current.name = type
        fileInputRef.current.click()
    }

    const uploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files[0]

        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', fileInputRef.current.name)

        try {
            await axios.post<Sub>(`/subs/${sub.name}/image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            revalidate()
        } catch (err) {
            console.log(err)
        }
    }

    if (error) router.push('/')

    let postsMarkup
    if (!sub) {
        postsMarkup = <p className="text-lg text-center">Loading..</p>
    } else if (sub.posts.length === 0) {
        postsMarkup = <p className="text-lg text-center">No posts submitted yet</p>
    } else {
        postsMarkup = sub.posts.map((post) => <PostCard key={post.identifier} post={post} revalidate={revalidate} />)
    }

    return (
        <>
            <Head>
                <title>{sub?.title}</title>
            </Head>
            {!sub ? null : (
                <div style={{ maxHeight: 'calc(100vh - 3rem)', height: '100%', overflowY: 'auto' }}>
                    <input type="file" hidden={true} ref={fileInputRef} onChange={uploadImage} />
                    {/* Sub info and images */}
                    <div>
                        {/* Banner image */}
                        <div
                            onClick={() => openFileInput('banner')}
                            className={cn('bg-blue-500', { 'cursor-pointer': ownSub })}
                        >
                            {sub?.bannerUrl ? (
                                <div
                                    className="h-56 bg-blue-500"
                                    style={{
                                        backgroundImage: `url(${sub.bannerUrl})`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                />
                            ) : (
                                <div className="h-20 bg-blue-500" />
                            )}
                        </div>
                    </div>
                    {/* Sub meta data */}
                    <div className="h-20 bg-white">
                        <div className="container flex relative">
                            <div className="absolute" style={{ top: -20 }}>
                                <div className="rounded-full border-4 border-solid border-white">
                                    <Image
                                        src={sub.imageUrl}
                                        alt={`${sub.name} sub image`}
                                        onClick={() => openFileInput('image')}
                                        className={cn('rounded-full', { 'cursor-pointer': ownSub })}
                                        width={72}
                                        height={72}
                                    />
                                </div>
                            </div>
                            <div className="pt-1 pl-24">
                                <div className="flex items-center">
                                    <h1 className="mb-1 text-3xl font-bold">{sub.title}</h1>
                                </div>
                                <p className="text-sm font-bold text-gray-500">/r/{sub.name}</p>
                            </div>
                        </div>
                    </div>
                    {/* Posts & Sidebar */}
                    <div className="container flex pt-5">
                        <div className="w-160">{postsMarkup}</div>
                        <Sidebar sub={sub} />
                    </div>
                </div>
            )}
        </>
    )
}
