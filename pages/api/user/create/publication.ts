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
    const requiredKeys = ['public_key', 'publication_hash', 'signature'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      public_key,
      publication_hash,
      signature
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

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        publication_hash
      }
    });

    res.status(200).json({
      success: 'Publication hash added',
      user: updated
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error adding publication hash',
    });
  }
};
