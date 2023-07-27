import { DEFAULT_OG_IMAGE } from '@/lib/config/constants';
import Head from 'next/head';
import Script from 'next/script';

interface SEO {
  title?: string;
  description?: string;
  image?: string;
  author?: string;
  blog_name?: string;
  url?: string;
}

export const DefaultHead = (config: SEO) => {
  return (
    <>
      <Head>
        {/* // REPLACE: URL, TITLE, DESCRIPTION, IMAGE */}
        <title>{config.title || 'Wordcel - Read, Write, Own'}</title>
        <meta name='description' content={config.description || 'Wordcel - Read, Write, Own'} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name="theme-color" content="white" />
        <link rel='icon' href='/favicon.png' />

        {config.author && (
          <meta name='author' content={config.author} />
        )}

        {config.blog_name && (
          <meta name='og:site_name' content={config.blog_name} />
        )}

        {/* // REPLACE: URL, TITLE, DESCRIPTION, IMAGE */}
        <meta property='og:type' content={config.author ? 'article' : 'website'} />
        <meta property='og:url' content={config.url || 'https://wordcelclub.com'} />
        <meta property='og:title' content={config.title || 'Wordcel - Read, Write, Own'} />
        <meta property='og:description' content={config.description || 'Wordcel - Read, Write, Own'} />
        <meta property='og:image' content={config.image || DEFAULT_OG_IMAGE} />
        
        {/* // REPLACE: URL, TITLE, DESCRIPTION, IMAGE */}
        <meta property='twitter:card' content='summary_large_image' />
        <meta property='twitter:url' content={config.url || 'https://wordcelclub.com'} />
        <meta property='twitter:title' content={config.title || 'Wordcel - Read, Write, Own'} />
        <meta property='twitter:description' content={config.description || 'Wordcel - Read, Write, Own'} />
        <meta property='twitter:image' content={config.image || DEFAULT_OG_IMAGE} />
      </Head>

      {/* // REPLACE: GOOGLE ANALYTICS */}
      {/* Google Analytics -- Start */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-WZLDV8RBNC"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-WZLDV8RBNC');
        `}
      </Script>
      {/* Google Analytics -- End */}

    </>
  );
};
