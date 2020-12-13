import Head from 'next/head'
import Link from 'next/link'

export default function Register() {
  return (
    <div className="flex">
      <Head>
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-screen bg-center bg-cover w-36" style={{ backgroundImage: "url('/images/bricks.jpg')" }}></div>

      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign Up</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our{' '}
            <a className="text-blue-600" target="_blank" href="https://www.redditinc.com/policies/user-agreement">
              User Agreement
            </a>{' '}
            and{' '}
            <a className="text-blue-600" target="_blank" href="https://www.redditinc.com/policies/privacy-policy">
              Privacy Policy
            </a>
          </p>
          <form>
            <div className="mb-6 ">
              <input type="checkbox" className="mr-1 cursor-pointer" id="agreement" />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuff on Reddit
              </label>
            </div>
            <div className="mb-2">
              <input
                type="email"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded"
                placeholder="Email"
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded"
                placeholder="Username"
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded"
                placeholder="Password"
              />
            </div>
            <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border border-blue-500 rounded">
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
