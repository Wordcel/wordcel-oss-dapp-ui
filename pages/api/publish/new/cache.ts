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
import { getHeaderContent } from '@/components/getHeaderContent';
import { sanitizeHtml } from '@/lib/sanitize';
import { getBlocks } from '@/components/getArticleBlocks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['public_key', 'cache_link', 'signature'];
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

    const blocks = await getBlocks(cache_link);
    if (!blocks) return;

    const {
      title,
      description,
      image_url,
      slug
    } = getHeaderContent(blocks);

    if (id) {
      const article = await prisma.article.findFirst({
        where: {
          id,
          owner: { public_key }
        },
      });

      if (!article) {
        res.status(400).json({
          error: 'Article does not exist'
        });
        return;
      }

      const updated = await prisma.article.update({
        where: {
          id: Number(id),
        },
        data: {
          title: sanitizeHtml(title),
          description: sanitizeHtml(description),
          image_url,
          slug,
          cache_link,
          on_chain: false,
          owner: {
            connect: {
              id: user.id
            }
          }
        }
      });

      res.status(200).json({
        success: 'Article updated',
        article: updated,
        username: user.username
      });

    }

    const newArticle = await prisma.article.create({
      data: {
        title: sanitizeHtml(title),
        description: sanitizeHtml(description),
        image_url,
        slug,
        cache_link,
        on_chain: false,
        owner: {
          connect: {
            id: user.id
          }
        }
      }
    });

    res.status(200).json({
      success: 'Article created',
      article: newArticle,
      username: user.username
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error publishing article',
    });
  }
}