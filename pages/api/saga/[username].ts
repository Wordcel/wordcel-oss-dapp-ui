import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.query;
  const user = await prisma.user.findFirst({ where: {
    username: username as string
  }});
  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  };
  const connection_count = await prisma.connection.count({
    where: { profile_owner: user.public_key }
  });
  const invited_by_inv = await prisma.invite.findFirst({
    where: {
      receiver: user.public_key
    }
  });
  const post_count = await prisma.article.count({
    where: {
      owner: { id: user.id }
    }
  });
  let invited_by;
  if (invited_by_inv) {
    invited_by = await prisma.user.findFirst({
      where: {
        id: invited_by_inv?.user_id
      }
    });
  }
  const userData = {
    ...user,
    connection_count,
    invited_by: invited_by ? {
      name: invited_by.name,
      username: invited_by.username,
    } : null
  };
  const articles = await prisma.article.findMany({
    take: 10,
    where: {
      owner: { id: user.id }
    },
    orderBy: {
      created_at: 'desc',
    }
  });
  res.status(200).json({
    user: userData,
    articles: JSON.parse(JSON.stringify(articles)),
    post_count
  });
};

export default handler;