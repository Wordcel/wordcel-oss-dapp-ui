import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'inter-ui/inter.css';
import '@fontsource/spectral';
import '@/styles/globals.scss';
import { Toaster } from 'react-hot-toast';
import { Wallet } from '@/layouts/Wallet';
import type { AppProps } from 'next/app'

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function Worcel({ Component, pageProps }: AppProps) {
  return (
    <Wallet>
      <div style={{ fontSize: '170%' }}>
        <Toaster />
      </div>
      <Component {...pageProps} />
    </Wallet>
  );
}

export default Worcel
