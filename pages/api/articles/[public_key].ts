import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { public_key, skip, take } = req.query;
  console.log(skip, take);

  const articles = await prisma.article.findMany({
    where: {
      owner: {
        public_key: public_key as string
      }
    },
    orderBy: {
      created_at: 'desc',
    },
    skip: typeof skip === 'string' ? Number(skip) : undefined,
    take: typeof take === 'string' ? Number(take) : undefined,
  });
  res.status(200).json(articles);
};

export default handler;