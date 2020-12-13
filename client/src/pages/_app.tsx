import '../styles/globals.css'
import { AppProps } from 'next/app'

const MyApp: React.FC<AppProps> = ({ Component, pageProps }): React.ReactElement => {
  return <Component {...pageProps} />
}

export default MyApp
