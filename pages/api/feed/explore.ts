import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

export default handler;