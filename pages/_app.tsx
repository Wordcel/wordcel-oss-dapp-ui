import Router from 'next/router';
import NProgress from 'nprogress';
import UserProvider from '@/components/Context';

import 'nprogress/nprogress.css';
import 'inter-ui/inter.css';
import '@fontsource/spectral';
import '@/styles/globals/index.scss';

import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { Wallet } from '@/layouts/Wallet';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function Worcel({ Component, pageProps }: any) {
  return (
    <NextUIProvider>
      <Wallet>
        <UserProvider>
          <div style={{ fontSize: '170%' }}>
            <Toaster />
          </div>
          <Component {...pageProps} />
        </UserProvider>
      </Wallet>
    </NextUIProvider>
  );
}

export default Worcel;
