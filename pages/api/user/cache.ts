// import prisma from '@/lib/prisma';
// import algoliasearch from 'algoliasearch';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { withSentry } from '@sentry/nextjs';
// import { ALGOLIA_APPLICATION_ID } from '@/lib/config/constants';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const users = await prisma.user.findMany();
  // if (process.env.ALGOLIA_KEY) {
  //   const client = algoliasearch(ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_KEY);
  //   const index = client.initIndex('users');
  //   await index.saveObjects(users, {
  //     autoGenerateObjectIDIfNotExist: true
  //   });
  //   res.send('Indexed!');
  // } else {
  //   console.log('Warning, Algolia API key not set, new users won\'t be indexed.');
  // }
  res.send('Uncomment the code to index all users :)');
};

export default withSentry(handler);