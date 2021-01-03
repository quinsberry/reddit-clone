import { AppProps } from 'next/app'
import axios from 'axios'

import '../styles/globals.css'

axios.defaults.baseURL = 'http://localhost:5000/api'
axios.defaults.withCredentials = true
const MyApp: React.FC<AppProps> = ({ Component, pageProps }): React.ReactElement => {
  return <Component {...pageProps} />
}

export default MyApp
