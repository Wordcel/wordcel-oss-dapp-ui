import { DEFAULT_OG_IMAGE } from '@/components/config/constants';
import Head from 'next/head';

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
    <Head>
      <title>{config.title || 'Wordcel - Read, Write, Own'}</title>
      <meta name='description' content={config.description || 'Wordcel - Read, Write, Own'} />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='icon' href='/favicon.png' />

      {config.author && (
        <meta name='author' content={config.author} />
      )}

      {config.blog_name && (
        <meta name='og:site_name' content={config.blog_name} />
      )}

      <meta property='og:type' content={config.author ? 'article' : 'website'} />
      <meta property='og:url' content={config.url || 'https://wordcel.club'} />
      <meta property='og:title' content={config.title || 'Wordcel - Read, Write, Own'} />
      <meta property='og:description' content={config.description || 'Wordcel - Read, Write, Own'} />
      <meta property='og:image' content={config.image || DEFAULT_OG_IMAGE} />

      <meta property='twitter:card' content='summary_large_image' />
      <meta property='twitter:url' content={config.url || 'https://wordcel.club'} />
      <meta property='twitter:title' content={config.title || 'Wordcel - Read, Write, Own'} />
      <meta property='twitter:description' content={config.description || 'Wordcel - Read, Write, Own'} />
      <meta property='twitter:image' content={config.image || DEFAULT_OG_IMAGE} />
    </Head>
  );
};
