import { FormEvent, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { InputGroup } from '@components/common/InputGroup'
import { useAuthDispatch, useAuthState } from '@context/auth.context'


export default function LoginPage() {
    const router = useRouter()
    const dispatch = useAuthDispatch()
    const { authenticated } = useAuthState()

    if (authenticated) {
        router.push('/')
    }

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    const handleOnChange = {
        username: (e: any) => setUsername(e.target.value),
        password: (e: any) => setPassword(e.target.value),
    }

    const submitForm = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const res = await axios.post('/auth/login', {
                username,
                password,
            })

            dispatch({ type: 'AUTH::LOGIN_SUCCESS', payload: res.data.data })
            router.back()

        } catch (err) {
            console.log('>> ', err.response.data.errors)
            setErrors(err.response.data.errors)
        }
    }

    return (
        <div className="flex bg-white">
            <Head>
                <title>Login</title>
            </Head>

            <div className="h-screen bg-center bg-cover w-36"
                 style={{ backgroundImage: 'url(\'/images/bricks.jpg\')' }}/>

            <div className="flex flex-col justify-center pl-6">
                <div className="w-70">
                    <h1 className="mb-2 text-lg font-medium">Login</h1>
                    <p className="mb-10 text-xs">
                        By continuing, you agree to our{' '}
                        <a className="text-blue-600" target="_blank"
                           href="https://www.redditinc.com/policies/user-agreement">
                            User Agreement
                        </a>{' '}
                        and{' '}
                        <a className="text-blue-600" target="_blank"
                           href="https://www.redditinc.com/policies/privacy-policy">
                            Privacy Policy
                        </a>
                    </p>
                    <form onSubmit={submitForm}>
                        <InputGroup
                            className="mb-2"
                            type="text"
                            error={errors.username}
                            placeholder="USERNAME"
                            value={username}
                            onChange={handleOnChange.username}
                        />
                        <InputGroup
                            className="mb-2"
                            type="password"
                            error={errors.password}
                            placeholder="PASSWORD"
                            value={password}
                            onChange={handleOnChange.password}
                        />
                        <button
                            type="submit"
                            className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
                            Log In
                        </button>
                    </form>
                    <small>
                        New to Reddit?
                        <Link href="/register">
                            <a className="ml-1 font-medium text-blue-500 uppercase">Sign Up</a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}
