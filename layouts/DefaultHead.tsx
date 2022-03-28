import Head from 'next/head';

interface SEO {
  title?: string;
  description?: string;
  image?: string;
}

export const DefaultHead = (config: SEO) => {
  return (
    <Head>
      <title>{config.title || 'Wordcel - Read, Write, Own'}</title>
      <meta name="description" content={config.description || 'Wordcel - Read, Write, Own'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.png" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://wordcel.club" />
      <meta property="og:title" content={config.title || 'Wordcel - Read, Write, Own'} />
      <meta property="og:description" content={config.description || 'Wordcel - Read, Write, Own'} />
      <meta property="og:image" content={config.image || 'https://bafkreielxpcbzu7nmn7dctpyxwfshjwfgx7f3357k4jvz77gbvxk3oasim.ipfs.nftstorage.link/'} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://wordcel.club" />
      <meta property="twitter:title" content={config.title || 'Wordcel - Read, Write, Own'} />
      <meta property="twitter:description" content={config.description || 'Wordcel - Read, Write, Own'} />
      <meta property="twitter:image" content={config.image || 'https://bafkreielxpcbzu7nmn7dctpyxwfshjwfgx7f3357k4jvz77gbvxk3oasim.ipfs.nftstorage.link/'} />
    </Head>
  );
}