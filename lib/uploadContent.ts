import slug from 'slug';
import toast from 'react-hot-toast';
import * as crypto from 'crypto';
import { uploadJSON } from './networkRequests';
import { OutputData } from "@editorjs/editorjs";
import { WalletContextState } from '@solana/wallet-adapter-react';
import { getHeaderContent } from './getHeaderContent';
import { getUserSignature } from './signMessage';

export interface ContentPayload {
  content: OutputData,
  type: string
}

export const uploadContent = async (
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

  const contentDigest = crypto.createHash('sha256').update(
    JSON.stringify(data.content)
  ).digest().toString('hex');

  const contentSignature = await wallet.signMessage(new TextEncoder().encode(contentDigest));
  if (!contentSignature) return;
  const contentSignatureString = Buffer.from(contentSignature).toString('base64');

  let mut_slug = '';

  const { title, image_url, description } = getHeaderContent(data.content.blocks);
  if (title) mut_slug = title
  if (!title) mut_slug = 'Untitled Article ' + Date.now();

  const sanitizedSlug = slug(mut_slug, {
    lower: true,
    remove: /[^A-Za-z0-9\s]/g
  });

  const finalData = {
    ...data,
    slug: sanitizedSlug,
    title: title || 'Untitled Article',
    image_url: image_url || '',
    description: description || '',
    authorship: {
      signature: contentSignatureString,
      publicKey: wallet.publicKey.toBase58(),
    },
    contentDigest,
    signatureEncoding: 'base64',
    digestEncoding: 'hex',
    parentDigest: parentDigest || '',
  };

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

  const userSignature = await getUserSignature(wallet.signMessage, wallet.publicKey.toBase58());
  if (!userSignature) return;

  const response = await uploadJSON(finalData, tags, wallet.publicKey.toBase58(), userSignature);
  if (response.url) return response.url;
};