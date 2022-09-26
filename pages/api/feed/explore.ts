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
  const articles = await prisma.article.findMany({
    take: 50,
    orderBy: {
      views: 'desc'
    }
  });
  res.status(200).json(articles);
};

export default withSentry(handler);