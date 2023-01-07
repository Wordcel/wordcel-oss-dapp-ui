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
  const from_date = new Date();
  from_date.setDate(from_date.getDate() - 28);
  const articles = await prisma.article.findMany({
    take: 4,
    where: {
      created_at: {
        gte: from_date
      },
      show_on_lp: true
    },
    orderBy: {
      views: 'desc'
    },
    include: {
      owner: true
    }
  });
  res.status(200).json(articles);
};

export default withSentry(handler);