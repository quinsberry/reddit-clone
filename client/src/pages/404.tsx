import Link from 'next/link'

export default function NotFoundPage() {
    return (
        <div className="flex flex-col items-center">
            <h1 className="mt-10 mb-4 text-5xl text-gray-800">Page not found</h1>
            <Link href="/">
                <a className="px-4 py-2 blue button">Home</a>
            </Link>
        </div>
    )
}
