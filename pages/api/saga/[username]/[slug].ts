import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { getBlocks } from '@/lib/getArticleBlocks';

async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username, slug } = req.query;
  const article = await prisma.article.findFirst({
    where: {
      slug: slug as string,
      owner: {
        username: {
          equals: username as string,
          mode: 'insensitive'
        }
      }
    }
  });

  if (!article) {
    res.status(404).json({
      error: 'Article not found'
    });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: article.user_id
    }
  });
  if (!user) {
    res.status(404).json({
      error: 'User not found'
    });
    return;
  }

  const arweave_data = await getBlocks(article.arweave_url, true);
  if (!arweave_data) {
    res.status(500).json({
      error: 'Server error: Arweave data not found'
    });
    return;
  }

  const blocks = JSON.stringify(arweave_data.content.blocks);
  if (!blocks) {
    res.status(500).json({
      error: 'Server error: Blocks not found'
    });
    return;
  }

  res.status(200).json({
    article: JSON.parse(JSON.stringify(article)),
    user_public_key: user.public_key,
    username: user.username,
    blocks,
    user,
    contentDigest: arweave_data?.contentDigest || '',
  });

}

export default handler;