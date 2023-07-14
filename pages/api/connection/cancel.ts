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
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['public_key', 'profile_owner', 'signature', 'account'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      public_key,
      profile_owner,
      signature,
      account
    } = req.body;

    const authenticated = authenticate(public_key, signature, res);
    if (!authenticated) return;

    const connection = await prisma.connection.findFirst({
      where: {
        connector: public_key,
        profile_owner: profile_owner,
        account: account,
      }
    })

    if (!connection) {
      res.status(400).json({
        error: 'Connection does not exist'
      });
      return;
    }

    const deleted = await prisma.connection.delete({
      where: {
        id: connection.id
      }
    })

    res.status(200).json({
      success: 'Connection cancelled'
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error cancelling connection',
    });
  }
};

export default handler;