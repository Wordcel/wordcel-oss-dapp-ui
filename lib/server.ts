import * as nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';
import { NextApiRequest, NextApiResponse } from 'next';
import { MESSAGE_TO_SIGN } from '@/components/config/constants';

export const verifyKeys = (
  req: NextApiRequest,
  res: NextApiResponse,
  requiredKeys: string[],
): boolean => {
  const data = req.body;
  const missingKeys = requiredKeys.filter((key) => (
    !Object.prototype.hasOwnProperty.call(data, key)
  ));
  if (missingKeys.length > 0) {
    res.status(400).json({ detail: `Missing Parameters: ${missingKeys.join(', ')}` });
    return false;
  }
  return true;
};

export const verifyMethod = (
  req: NextApiRequest,
  res: NextApiResponse,
  method: string,
): boolean => {
  if (req.method !== method) {
    res.setHeader('Allow', [method]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return false;
  }
  return true;
};

export const authenticate = (
  public_key: string,
  signature: any,
  res: NextApiResponse,
): boolean => {
  const message = new TextEncoder().encode(MESSAGE_TO_SIGN);
  const public_key_bytes = new PublicKey(public_key).toBytes();
  const parsedSignature = new Uint8Array(signature.data ? signature.data : Object.values(signature));
  const verified = nacl.sign.detached.verify(message, parsedSignature, public_key_bytes);
  if (!verified) {
    res.status(401).json({ detail: 'Unauthenticated' });
    return false;
  }
  return true;
};
