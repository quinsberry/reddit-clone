import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import axios from 'axios'

import { Navbar } from '@components/Navbar'

import '@styles/tailwind.css'

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.withCredentials = true
const MyApp: React.FC<AppProps> = ({ Component, pageProps }): React.ReactElement => {
  const { pathname } = useRouter()
  const authRoutes = ['/register', '/login']
  const authRoute = authRoutes.includes(pathname)
  return (
    <>
      {!authRoute && <Navbar />}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
