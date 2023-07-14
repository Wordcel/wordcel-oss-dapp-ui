import prisma from '@/lib/prisma';
import algoliasearch from 'algoliasearch';
import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  verifyKeys,
  verifyMethod,
  authenticate
} from '@/lib/server';
import { verifySolDomain, verifyWAODomain } from '@/lib/verifyDomain';
import { newUserAlert } from '@/lib/sendUserActivity';
import { ALGOLIA_APPLICATION_ID } from '@/lib/config/constants';


async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    const solDomain = username.includes('.sol');
    const waoDomain = username.includes('.wao');
    const validDomain = solDomain || waoDomain;

    if (!validDomain) {
      res.status(400).json({
        error: 'You must have a .SOL domain to continue'
      });
      return;
    }

    const verified = waoDomain ? await verifyWAODomain(public_key, username) : await verifySolDomain(public_key, username);

    if (!verified) {
      res.status(400).json({
        error: 'Invalid Domain'
      });
      return;
    };

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

    if (process.env.ALGOLIA_KEY) {
      const client = algoliasearch(ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_KEY);
      const index = client.initIndex('users');
      index.saveObject(new_profile, {
        autoGenerateObjectIDIfNotExist: true
      });
    } else {
      console.log('Warning, Algolia API key not set, new users won\'t be indexed.');
    }

    newUserAlert(new_profile);

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

export default handler;