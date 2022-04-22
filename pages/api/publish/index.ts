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