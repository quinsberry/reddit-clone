import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import axios from 'axios'

import { AuthProvider } from '@context/auth.context'

import { Navbar } from '@components/Navbar'

import '@styles/tailwind.css'
import '@styles/icons.css'

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.withCredentials = true
const MyApp: React.FC<AppProps> = ({ Component, pageProps }): React.ReactElement => {

    const { pathname } = useRouter()
    const authRoutes = ['/register', '/login']
    const authRoute = authRoutes.includes(pathname)

    return (
        <AuthProvider>
            {!authRoute && <Navbar/>}
            <Component {...pageProps} />
        </AuthProvider>
    )
}

export default MyApp
