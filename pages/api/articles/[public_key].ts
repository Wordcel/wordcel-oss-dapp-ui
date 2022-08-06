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
  const { public_key } = req.query;
  const articles = await prisma.article.findMany({
    where: {
      owner: {
        public_key: public_key as string
      }
    },
    orderBy: {
      updated_at: 'desc',
    }
  });
  res.status(200).json(articles);
};

export default withSentry(handler);