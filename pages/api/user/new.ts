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
import { verifySolDomain } from '@/lib/verifySolDomain';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['name', 'public_key', 'username', 'blog_name', 'image_url', 'profile_hash', 'signature'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;

    const {
      name,
      public_key,
      username,
      blog_name,
      signature,
      profile_hash,
      twitter,
      image_url
    } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { public_key },
          { username }
        ]
      }
    });

    if (user) {
      res.status(400).json({
        error: 'User already exists'
      });
      return;
    }

    const authenticated = authenticate(public_key, signature, res);
    if (!authenticated) return;

    if (username.includes('.sol')) {
      const verified = await verifySolDomain(public_key, username);
      if (!verified) {
        res.status(400).json({
          error: 'Invalid SOL Domain'
        });
        return;
      };
    } else {
      // verify twitter username is verified
      const twitter_exists = await prisma.verifiedTwitter.findFirst({
        where: {
          public_key,
          username
        }
      });
      if (!twitter_exists) {
        res.status(400).json({
          error: 'Twitter not verified'
        });
        return;
      }
    }

    const new_profile = await prisma.user.create({
      data: {
        name,
        public_key,
        username,
        blog_name,
        profile_hash,
        image_url,
        twitter: twitter || ''
      }
    });

    res.status(200).json({
      success: 'Profile created',
      user: new_profile
    });

  } catch (e) {
    console.error('Request error', e);
    res.status(500).json({
      error: 'Error creating new profile',
    });
  }
}