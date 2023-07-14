import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
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

export default handler;