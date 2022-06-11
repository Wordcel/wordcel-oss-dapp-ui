import Bundlr from '@bundlr-network/client';
import {
  MAINNET_ENDPOINT,
  BUNDLR_MAINNET_ENDPOINT
} from '@/components/config/constants';
import { ContentPayload } from '@/components/upload';
import { WalletContextState } from '@solana/wallet-adapter-react';

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

  // Bug: This shows 0
  const currentBalance = await bundlr.getLoadedBalance();
  console.log(`Current Balance: ${currentBalance}`);

  if (currentBalance.lt(minimumFunds)) {
    const toFundAmount = price.multipliedBy(10);
    console.log(`Funding: ${toFundAmount}`);
    await bundlr.fund(toFundAmount);
  }

  const transaction = bundlr.createTransaction(stringData, { tags });
  await transaction.sign();
  await transaction.upload();
  const id = transaction.id;
  return `https://arweave.net/${id}`
};
