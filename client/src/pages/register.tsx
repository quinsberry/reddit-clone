import { FormEvent, useState } from 'react'
import axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { InputGroup } from '@components/common/InputGroup'
import { useAuthState } from '@context/auth.context'


export default function RegisterPage() {
    const router = useRouter()
    const { authenticated } = useAuthState()

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [agreement, setAgreement] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})

    if (authenticated) {
        router.push('/')
    }

    const handleOnChange = {
        agreement: (e: any) => setAgreement(e.target.checked),
        email: (e: any) => setEmail(e.target.value),
        username: (e: any) => setUsername(e.target.value),
        password: (e: any) => setPassword(e.target.value),
    }

    const submitForm = async (e: FormEvent) => {
        e.preventDefault()

        if (!agreement) {
            return setErrors({ ...errors, agreement: 'You must agree to T&Cs' })
        }

        try {
            await axios.post('/auth/register', {
                email,
                password,
                username,
            })

            router.push('/login')
        } catch (err) {
            console.log('>> ', err.response.data.errors)
            setErrors(err.response.data.errors)
        }
    }

    return (
        <div className="flex bg-white">
            <Head>
                <title>Register</title>
            </Head>

            <div className="h-screen bg-center bg-cover w-36"
                 style={{ backgroundImage: 'url(\'/images/bricks.jpg\')' }}/>

            <div className="flex flex-col justify-center pl-6">
                <div className="w-70">
                    <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
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
                        <div className="mb-6 ">
                            <input
                                type="checkbox"
                                className="mr-1 cursor-pointer"
                                id="agreement"
                                checked={agreement}
                                onChange={handleOnChange.agreement}
                            />
                            <label htmlFor="agreement" className="text-xs cursor-pointer">
                                I agree to get emails about cool stuff on Reddit
                            </label>
                            <small className="block font-medium text-red-600">{errors.agreement}</small>
                        </div>
                        <InputGroup
                            className="mb-2"
                            type="email"
                            error={errors.email}
                            placeholder="EMAIL"
                            value={email}
                            onChange={handleOnChange.email}
                        />
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
                            Sign Up
                        </button>
                    </form>
                    <small>
                        Already a Reddit?
                        <Link href="/login">
                            <a className="ml-1 font-medium text-blue-500 uppercase">Log In</a>
                        </Link>
                    </small>
                </div>
            </div>
        </div>
    )
}
