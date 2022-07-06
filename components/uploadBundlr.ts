import * as crypto from 'crypto';
import slugify from 'slugify';
import toast from 'react-hot-toast';
import Bundlr from '@bundlr-network/client';
import {
  MAINNET_ENDPOINT,
  BUNDLR_MAINNET_ENDPOINT
} from '@/components/config/constants';
import { ContentPayload } from '@/components/upload';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { getBundlrBalance } from './networkRequests';
import { getHeaderContent } from './getHeaderContent';

export const uploadBundle = async (
  data: ContentPayload,
  wallet: WalletContextState,
  postAccount: string,
  profileAccount: string,
  parentDigest?: string
) => {
  if (!wallet.signMessage) {
    toast.error('Sorry, your wallet does not support message signature');
    return;
  }

  if (!wallet.publicKey) return;

  const bundlr = new Bundlr(
    BUNDLR_MAINNET_ENDPOINT,
    'solana',
    wallet,
    {
      timeout: 60000,
      providerUrl: MAINNET_ENDPOINT,
    },
  );

  const contentDigest = crypto.createHash('sha256').update(
    JSON.stringify(data.content)
  ).digest().toString('hex');

  const signature = await wallet.signMessage(new TextEncoder().encode(contentDigest));
  if (!signature) return;
  const stringSignature = Buffer.from(signature).toString('base64');

  let mut_slug = '';

  const { title, image_url, description } = getHeaderContent(data.content.blocks);
  if (title) mut_slug = title
  if (!title) mut_slug = 'Untitled Article ' + Date.now();

  const sanitizedSlug = slugify(mut_slug, {
    lower: true,
    remove: /[*+~.()'"!:@]/g
  });

  const finalData = {
    ...data,
    slug: sanitizedSlug,
    title: title || 'Untitled Article',
    image_url: image_url || '',
    description: description || '',
    authorship: {
      signature: stringSignature,
      publicKey: wallet.publicKey.toBase58(),
    },
    contentDigest,
    signatureEncoding: 'base64',
    digestEncoding: 'hex',
    parentDigest: parentDigest || '',
  }

  const stringData = JSON.stringify(finalData);

  const tags = [
    { name: "Content-Type", value: "application/json" },
    { name: "Content-Digest", value: contentDigest },
    { name: "App-Name", value: "Wordcel" },
    { name: "Author", value: wallet.publicKey.toBase58() },
    { name: "Title", value: title || 'Untitled Article' },
    { name: "Slug", value: sanitizedSlug },
    { name: "Description", value: description || '' },
    { name: "Image-URL", value: image_url || '' },
    { name: "Publish-Date", value: new Date().getTime().toString() },
    { name: "Profile Account", value: profileAccount },
    { name: "Post Account", value: postAccount },
    { name: "Parent Digest", value: parentDigest || '' },
  ];

  // Counts byte stize of stringData
  const size = new Blob([stringData]).size;
  console.log('Byte Size', size);

  const price = await bundlr.getPrice(size);
  console.log('Price', price);

  const minimumFunds = price.multipliedBy(3);
  console.log('Minimum Funds', minimumFunds);

  let skipFund = false;

  if (wallet.publicKey) {
    const currentBalance = await getBundlrBalance(wallet.publicKey.toBase58());
    console.log('Current Balance', currentBalance);
    if (!currentBalance.lt(minimumFunds)) skipFund = true;
  }

  if (!skipFund) {
    const toFundAmount = price.multipliedBy(20);
    console.log(`Funding: ${toFundAmount}`);
    try {
      await bundlr.fund(toFundAmount);
    }
    catch (e) {
      console.log(e);
      toast.dismiss();
      toast.error('Sorry, we were not able to fund the upload');
      return;
    }
  }

  const transaction = bundlr.createTransaction(stringData, { tags });
  await transaction.sign();
  await transaction.upload();
  const id = transaction.id;
  return `https://arweave.net/${id}`
};

export const uploadImageBundlr = async (
  image: File,
  wallet: WalletContextState
) => {
  toast.loading('Uploading Image');
  const extension = image.name.split('.').pop();
  const type = extension === 'jpg' ? 'jpeg' : extension;
  const tags = [{ name: "Content-Type", value: `image/${type}` }];

  const bundlr = new Bundlr(
    BUNDLR_MAINNET_ENDPOINT,
    'solana',
    wallet,
    {
      timeout: 60000,
      providerUrl: MAINNET_ENDPOINT,
    },
  );

  const size = image.size;
  console.log('Byte Size', size);

  const price = await bundlr.getPrice(size);
  console.log('Price', price);

  const minimumFunds = price.multipliedBy(3);
  console.log('Minimum Funds', minimumFunds);

  let skipFund = false;

  if (wallet.publicKey) {
    const currentBalance = await getBundlrBalance(wallet.publicKey.toBase58());
    console.log('Current Balance', currentBalance);
    if (!currentBalance.lt(minimumFunds)) skipFund = true;
  }

  if (!skipFund) {
    toast.dismiss();
    toast.loading('Funding Bundlr for upload');
    const toFundAmount = price.multipliedBy(50);
    console.log(`Funding: ${toFundAmount}`);
    try {
      await bundlr.fund(toFundAmount);
    }
    catch (e) {
      console.log(e);
      toast.dismiss();
      toast.error('Sorry, we were not able to fund the upload');
      return;
    }
  }

  const file = new Uint8Array(await image.arrayBuffer());
  const transaction = bundlr.createTransaction(file, { tags });
  await transaction.sign();
  await transaction.upload();
  const id = transaction.id;
  if (!id) {
    toast.dismiss();
    toast.error('Error uploading image');
    return;
  }
  const url = 'https://arweave.net/' + id;
  toast.dismiss();
  toast.success('Image stored permanently');
  return url;
};
