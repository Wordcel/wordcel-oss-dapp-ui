import fs from 'fs';
import Bundlr from '@bundlr-network/client';
import * as nacl from 'tweetnacl';

import { PublicKey } from '@solana/web3.js';
import { NextApiRequest, NextApiResponse } from 'next';
import { MESSAGE_TO_SIGN } from '@/lib/config/constants';
import { Keypair } from '@solana/web3.js';
import { File as FormidableFile } from "formidable";
import {
  MAINNET_ENDPOINT,
  BUNDLR_MAINNET_ENDPOINT
} from '@/lib/config/constants';
import { getBundlrBalance } from './networkRequests';

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

export const uploadImageNode = async (
  image: FormidableFile,
  keypair: Keypair
) => {
  if (!image.originalFilename) return { url: null, error: "File name not present" };

  const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  const extension = image.originalFilename.split('.').pop();

  if (!extension) {
    return { url: null, error: "Invalid file extension" }
  }

  if (!allowedExtensions.includes(extension)) {
    return { url: null, error: "File type not allowed" }
  }

  const type = extension === 'jpg' ? 'jpeg' : extension;
  const tags = [{ name: "Content-Type", value: `image/${type}` }];

  const bundlr = new Bundlr(
    BUNDLR_MAINNET_ENDPOINT,
    'solana',
    keypair.secretKey,
    {
      timeout: 60000,
      providerUrl: MAINNET_ENDPOINT,
    },
  );

  const size = image.size;
  const price = await bundlr.getPrice(size);
  const minimumFunds = price.multipliedBy(3);

  let skipFund = false;

  if (keypair.publicKey) {
    const currentBalance = await getBundlrBalance(keypair.publicKey.toBase58());
    console.log('Current Balance', currentBalance);
    if (!currentBalance.lt(minimumFunds)) skipFund = true;
  }

  if (!skipFund) {
    const toFundAmount = price.multipliedBy(50);
    console.log(`Funding: ${toFundAmount}`);
    try {
      await bundlr.fund(toFundAmount);
    }
    catch (e) {
      console.log(e);
      return { url: null, error: "Insufficient balance to upload" };
    }
  }
  const arrayBuffer = fs.readFileSync(image.filepath, null);
  const file = new Uint8Array(arrayBuffer);
  const transaction = bundlr.createTransaction(file, { tags });
  await transaction.sign();
  await transaction.upload();
  const id = transaction.id;

  if (!id) {
    return { url: null, error: "Error while trying to upload image to arweave" };
  }

  const url = 'https://arweave.net/' + id;
  return { url: url, error: null };
}