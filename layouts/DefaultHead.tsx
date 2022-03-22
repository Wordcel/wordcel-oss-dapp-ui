import Head from 'next/head';

export const DefaultHead = () => {
  return (
    <Head>
      <title>Wordcel - Read, Write, Own</title>
      <meta name="description" content="Wordcel - Read, Write, Own" />
      <link rel="icon" href="/favicon.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
}