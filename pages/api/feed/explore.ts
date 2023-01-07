import NextCors from 'nextjs-cors';
import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { withSentry } from '@sentry/nextjs';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const articles = await prisma.article.findMany({
    take: 30,
    orderBy: {
      created_at: 'desc'
    },
    include: {
      owner: true
    }
  });
  res.status(200).json(articles);
};

export default withSentry(handler);