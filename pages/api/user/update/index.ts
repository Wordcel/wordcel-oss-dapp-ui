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
import { withSentry } from '@sentry/nextjs';

async function handler(
  req: NextApiRequest, res: NextApiResponse
) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['public_key', 'signature'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      public_key,
      signature,
      name,
      bio,
      blog_name,
      image_url,
      twitter,
      discord
    } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        public_key,
      }
    });

    if (!user) {
      res.status(404).json({
        error: 'User does not exist'
      });
      return;
    }

    const authenticated = authenticate(public_key, signature, res);
    if (!authenticated) return;

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: name || user.name,
        bio: bio || user.bio,
        blog_name: blog_name || user.blog_name,
        image_url: image_url || user.image_url,
        twitter: twitter,
        discord: discord
      }
    });

    res.status(200).json({
      user: updatedUser
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error updating profile',
    });
  }
}

export default withSentry(handler);