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
import { sanitizeHtml } from '@/lib/sanitize';
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

    const updated = await prisma.article.update({
      where: {
        id: id_int,
      },
      data: {
        arweave_url,
        on_chain: true,
        proof_of_post
      }
    });

    const blocks_updated = await updateBlocks(arweave_url);

    res.status(200).json({
      success: 'Article updated',
      article: updated
    });


  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error publishing article',
    });
  }
}

async function updateBlocks(
  arweave_url: string
) {
  const blocks = await getBlocks(arweave_url);
  const title = blocks[0].data.text;
  const description = blocks[1].data.text;
  const image_url = blocks[2].data.url;
  const string_blocks = JSON.stringify(blocks.slice(0, 3));
  if (!blocks) return;
  const existing_db_blocks = await prisma.block.findFirst({
    where: {
      article: { arweave_url }
    }
  });
  if (!existing_db_blocks) return;
  const article_update = await prisma.article.update({
    where: {
      id: existing_db_blocks.article_id
    },
    data: {
      title: sanitizeHtml(title) || '',
      description: sanitizeHtml(description) || '',
      image_url: image_url || '',
    }
  });
  const updated = await prisma.block.update({
    where: { id: existing_db_blocks.id },
    data: {
      data: string_blocks
    }
  });
};
