import Bundlr from '@bundlr-network/client';
import {
  MAINNET_ENDPOINT,
  BUNDLR_MAINNET_ENDPOINT
} from '@/components/config/constants';
import { ContentPayload } from '@/components/upload';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { getBundlrBalance } from './networkRequests';
import toast from 'react-hot-toast';

export const uploadBundle = async (
  data: ContentPayload,
  wallet: WalletContextState
) => {
  const bundlr = new Bundlr(
    BUNDLR_MAINNET_ENDPOINT,
    'solana',
    wallet,
    {
      timeout: 60000,
      providerUrl: MAINNET_ENDPOINT,
    },
  );

  const stringData = JSON.stringify(data);
  const tags = [{ name: "Content-Type", value: "text/json" }];

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
    await bundlr.fund(toFundAmount);
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
    await bundlr.fund(toFundAmount);
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
