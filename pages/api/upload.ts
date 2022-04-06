import type {
  NextApiRequest,
  NextApiResponse,
} from 'next';
import {
  verifyKeys,
  verifyMethod
} from '@/lib/server';
import { uploadArweave } from '@/components/upload';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const allowed = verifyMethod(req, res, 'POST');
  if (!allowed) return;
  try {
    const requiredKeys = ['data'];
    const allKeysPresent = verifyKeys(req, res, requiredKeys);
    if (!allKeysPresent) return;
    const { data } = req.body;
    console.log(data)
    const URI = await uploadArweave(data);
    if (!URI) {
      res.status(500).json({
        error: 'Failed to upload blocks'
      });
      return;
    }
    res.status(200).json({
      arweave_url: URI
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
};
