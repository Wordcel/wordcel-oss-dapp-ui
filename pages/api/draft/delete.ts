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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'DELETE');
  if (!allowed) return;
  try {
    const requiredKeys = ['public_key', 'signature', 'id'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      public_key,
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

    const existing = await prisma.draft.findFirst({
      where: {
        id: Number(id),
        owner: {
          id: user.id
        }
      }
    });

    if (!existing) {
      res.status(400).json({
        error: 'Draft does not exist'
      });
      return;
    }

    const block = await prisma.block.findFirst({
      where: {
        draft: {
          id: existing.id
        }
      }
    });

    if (block) {
      const block_deleted = await prisma.block.delete({
        where: { id: block.id }
      })
    }

    const updated = await prisma.draft.delete({
      where: { id: Number(id) }
    });

    res.status(200).json({
      success: 'Draft deleted successfully'
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error deleting draft',
    });
  }
}

export default handler;
