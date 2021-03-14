import Link from 'next/link'

import { useAuthDispatch, useAuthState } from '@context/auth.context'

import RedditLogo from '@assets/reddit-icon.svg'
import axios from 'axios'
import { LoadingStatus } from '@tps/util.types'


interface NavbarProps {
}

export const Navbar: React.FC<NavbarProps> = (): React.ReactElement => {
    const { authenticated, loadingStatus } = useAuthState()
    const dispatch = useAuthDispatch()

    const logout = async () => {
        try {
            await axios.get('/auth/logout')

            dispatch({ type: 'AUTH::LOGOUT' })
            window.location.reload()

        } catch(e) {
            console.log(e)
        }
    }

    return (
        <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5 bg-white">
            {/* Logo */}
            <div className="flex items-center">
                <Link href="/">
                    <a>
                        <RedditLogo className="w-8 h-8 mr-2"/>
                    </a>
                </Link>
                <span className="text-2xl font-semibold">
          <Link href="/">
            <a>reddit</a>
          </Link>
        </span>
            </div>

            {/* Search Input */}
            <div className="flex items-center mx-auto bg-gray-100 border rounded hover:border-blue-500 hover:bg-white">
                <i className="pl-4 pr-3 text-gray-500 fas fa-search"/>
                <input type="text" placeholder="Search"
                       className="py-1 pr-3 bg-transparent rounded w-160 focus:outline-none"/>
            </div>

            {/* Auth buttons */}
            <div className="flex">
                {loadingStatus !== LoadingStatus.NEVER && loadingStatus !== LoadingStatus.LOADING ? (
                    authenticated ? (
                        <button className="w-32 py-1 mr-4 leading-5 hollow blue button" onClick={logout}>Logout</button>
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
                ): null}
            </div>
        </div>
    )
}
