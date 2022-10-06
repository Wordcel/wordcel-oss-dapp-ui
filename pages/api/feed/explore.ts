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
  const from_date = new Date();
  from_date.setDate(from_date.getDate() - 14);

  const articles = await prisma.article.findMany({
    take: 100,
    where: {
      created_at: {
        gte: from_date
      }
    },
    include: {
      owner: true
    }
  });
  articles.sort((a, b) => b.views - a.views);
  res.status(200).json(articles);
};

export default withSentry(handler);