import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  verifyKeys,
  verifyMethod,
  authenticate
} from '@/lib/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['public_key', 'cache_link', 'signature', 'id'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      public_key,
      cache_link,
      signature,
      id
    } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        public_key,
      }
    });

    if (!user) {
      res.status(400).json({
        error: 'User does not exist'
      });
      return;
    }

    const authenticated = authenticate(public_key, signature, res);
    if (!authenticated) return;

    const article = await prisma.article.findFirst({
      where: {
        id: Number(id),
        owner: { public_key }
      }
    });

    if (!article) {
      res.status(400).json({
        error: 'Article does not exist'
      });
      return;
    }

    const newArticle = await prisma.article.update({
      where: {
        id: article.id
      },
      data: {
        cached_at: new Date(),
        cache_link: cache_link,
      }
    });

    res.status(200).json({
      success: 'Article cached',
      article: newArticle,
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error caching article',
    });
  }
}