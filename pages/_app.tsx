import Router from 'next/router';
import NProgress from 'nprogress';
import dotenv from 'dotenv';

import 'react-pagination-bar/dist/index.css'
import 'nprogress/nprogress.css';
import 'inter-ui/inter.css';
import '@fontsource/spectral';
import '@/styles/globals/index.scss';

import { SidebarProvider, UserProvider } from '@/components/Context';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { Wallet } from '@/components/Wallet';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

dotenv.config();

function Worcel({ Component, pageProps }: any) {
  return (
    // @ts-expect-error
    <NextUIProvider>
      <Wallet>
        <SidebarProvider>
          <UserProvider>
              <div style={{ fontSize: '170%' }}>
                <Toaster />
              </div>
              <Component {...pageProps} />
          </UserProvider>
        </SidebarProvider>
      </Wallet>
    </NextUIProvider>
  );
}

export default Worcel;
