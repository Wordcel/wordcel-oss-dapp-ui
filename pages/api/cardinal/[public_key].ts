import prisma from '@/lib/prisma';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { withSentry } from '@sentry/nextjs';
import { PublicKey } from '@solana/web3.js';
import { getIdentity } from '@/lib/cardinal';
import { getUserIdAndGuestToken } from '@/lib/verifyTwitter';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { public_key } = req.query;
    const pub_key_string = public_key as string;
    const identity = await getIdentity(
      new PublicKey(pub_key_string)
    );
    if (!identity?.username) {
      res.status(404).json({
        error: 'Identity not found',
      });
      return;
    };
    const twitter_data = await getUserIdAndGuestToken(identity.username);
    if (!twitter_data || !twitter_data.id) {
      res.status(404).json({
        error: 'Twitter data not found',
      });
      return;
    };
    const existing_value = await prisma.verifiedTwitter.findFirst({
      where: {
        twitter_user_id: twitter_data.id,
      }
    });
    if (existing_value) {
      res.status(200).json({
        success: true,
        message: 'Already verified',
        identity
      });
      return;
    }
    await prisma.verifiedTwitter.create({
      data: {
        public_key: pub_key_string,
        username: identity.username,
        twitter_user_id: twitter_data.id
      }
    });
    res.status(200).json({
      success: true,
      message: 'Twitter Verified through Cardinal',
      identity
    });
  }
  catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
}

export default withSentry(handler);