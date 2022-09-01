import Router from 'next/router';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';
import 'inter-ui/inter.css';
import '@fontsource/spectral';
import '@/styles/globals/index.scss';
import '@wordcel/dialect-react/index.css';

import { CardinalProvider, SidebarProvider, UserProvider } from '@/components/Context';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { Wallet } from '@/components/Wallet';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());


function Worcel({ Component, pageProps }: any) {
  return (
    // @ts-expect-error
    <NextUIProvider>
      <Wallet>
        <SidebarProvider>
          <UserProvider>
            <CardinalProvider>
              <div style={{ fontSize: '170%' }}>
                <Toaster />
              </div>
              <Component {...pageProps} />
            </CardinalProvider>
          </UserProvider>
        </SidebarProvider>
      </Wallet>
    </NextUIProvider>
  );
}

export default Worcel;
