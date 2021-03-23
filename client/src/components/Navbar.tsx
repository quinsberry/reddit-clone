import { ChangeEvent, FC, ReactElement, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'

import { useAuthDispatch, useAuthState } from '@context/auth.context'
import { LoadingStatus } from '@tps/util.types'

import RedditLogo from '@assets/reddit-icon.svg'
import { Sub } from '@tps/data.types'
import { ServerResponse } from '@tps/api.types'
import { useDebounce } from '@hooks/useDebounce'
import { useRouter } from 'next/router'


interface NavbarProps {}

export const Navbar: FC<NavbarProps> = (): ReactElement => {
    const { authenticated, loadingStatus } = useAuthState()
    const router = useRouter()
    const dispatch = useAuthDispatch()

    const [name, setName] = useState('')
    const [subs, setSubs] = useState<Sub[]>([])

    const debouncedSearchSubs = useDebounce(searchSubs, 500)

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)

    useEffect(() => {
        if (name.trim() === '') {
            setSubs([])
            return
        }

        debouncedSearchSubs()
    }, [name])

    async function searchSubs() {
        try {
            const { data } = await axios.get<ServerResponse<Sub[]>>(`/subs/search/${name}`)

            if (data.status === 'success') {
                setSubs(data.data)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const goToSub = (subName: string) => {
        router.push(`/r/${subName}`)
        setName('')
    }

    const logout = async () => {
        try {
            await axios.get('/auth/logout')

            dispatch({ type: 'AUTH::LOGOUT' })
            window.location.reload()
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
            {/* Logo */}
            <div className="flex items-center">
                <Link href="/">
                    <a>
                        <RedditLogo className="w-8 h-8 mr-2" />
                    </a>
                </Link>
                <span className="text-2xl font-semibold">
                    <Link href="/">
                        <a>reddit</a>
                    </Link>
                </span>
            </div>

            {/* Search Input */}
            <div className="relative flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
                <i className="pl-4 pr-3 text-gray-500 fas fa-search" />
                <input
                    type="text"
                    value={name}
                    onChange={handleSearchChange}
                    placeholder="Search"
                    className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"
                />
                <div
                    className="absolute left-0 right-0 bg-white"
                    style={{ top: 'calc(100% + 2px)' }}
                >
                    {name.length === 0 ? null : subs.map((sub) => (
                        <div
                            key={sub.name}
                            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-200"
                            onClick={() => goToSub(sub.name)}
                        >
                            <Image
                                src={sub.imageUrl}
                                className="rounded-full"
                                alt="Sub"
                                height={(8 * 16) / 4}
                                width={(8 * 16) / 4}
                            />
                            <div className="ml-4 text-sm">
                                <p className="font-medium">{sub.name}</p>
                                <p className="text-gray-600">{sub.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Auth buttons */}
            <div className="flex">
                {loadingStatus !== LoadingStatus.NEVER && loadingStatus !== LoadingStatus.LOADING ? (
                    authenticated ? (
                        <button className="w-32 py-1 mr-4 leading-5 hollow blue button" onClick={logout}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link href="/login">
                                <a className="w-32 py-1 mr-4 leading-5 hollow blue button">log in</a>
                            </Link>
                            <Link href="/register">
                                <a className="w-32 py-1 leading-5 blue button">sign up</a>
                            </Link>
                        </>
                    )
                ) : null}
            </div>
        </div>
    )
}
