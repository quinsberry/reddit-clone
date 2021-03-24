import axios from 'axios'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'

import { AuthProvider } from '@context/auth.context'

import { Navbar } from '@components/Navbar'

import '@styles/tailwind.css'
import '@styles/icons.css'
import { ServerResponse } from '@tps/api.types'


const fetcher = async (url: string) => {
    try {
        const res = await axios.get<ServerResponse<unknown>>(url)

        if (res.data.status === 'error') {
            return res.data
        }

        return res.data.data
    } catch (err) {
        throw err.response.data
    }
}

axios.defaults.baseURL = 'http://localhost:5000/api'
const MyApp: React.FC<AppProps> = ({ Component, pageProps }): React.ReactElement => {
    const { pathname } = useRouter()
    const authRoutes = ['/register', '/login']
    const authRoute = authRoutes.includes(pathname)

    return (
        <SWRConfig
            value={{
                fetcher,
                dedupingInterval: 5000,
            }}
        >
            <AuthProvider>
                <div style={{ height: '100vh', overflow: 'hidden' }}>
                    {!authRoute && <Navbar />}
                    <Component {...pageProps} />
                </div>
            </AuthProvider>
        </SWRConfig>
    )
}
axios.defaults.withCredentials = true

export default MyApp
