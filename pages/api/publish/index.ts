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
import { getBlocks } from '@/components/getArticleBlocks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['public_key', 'id', 'arweave_url', 'signature', 'proof_of_post'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      public_key,
      id,
      arweave_url,
      signature,
      proof_of_post
    } = req.body;

    const authenticated = authenticate(public_key, signature, res);
    if (!authenticated) return;

    const id_int = Number(id);

    if (isNaN(id_int)) {
      res.status(400).json({ detail: 'Invalid ID' });
      return;
    }

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

    const exists = await prisma.article.findFirst({
      where: {
        id: id_int,
        owner: { public_key }
      }
    });

    if (!exists) {
      res.status(400).json({
        error: 'Article does not exist'
      });
      return;
    }

    const blocks = await getBlocks(arweave_url);
    if (!blocks) return;

    const {
      title,
      description,
      image_url,
      slug
    } = getHeaderContent(blocks);

    const updated = await prisma.article.update({
      where: {
        id: id_int,
      },
      data: {
        arweave_url,
        on_chain_version: new Date(),
        on_chain: true,
        proof_of_post,
        title,
        description,
        image_url,
        slug
      }
    });

    res.status(200).json({
      success: 'Article updated',
      article: updated,
      username: user.username
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error publishing article',
    });
  }
}