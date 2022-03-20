import '@/styles/globals.scss'
import type { AppProps } from 'next/app'

function Worcel({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default Worcel
