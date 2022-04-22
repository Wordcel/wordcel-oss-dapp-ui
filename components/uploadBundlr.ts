import Bundlr from '@bundlr-network/client';
import {
  ENDPOINT,
  BUNDLR_DEVNET_ENDPOINT
} from '@/components/config/constants';
import { ContentPayload } from '@/components/upload';
import { WalletContextState } from '@solana/wallet-adapter-react';

export const uploadBundle = async (
  data: ContentPayload,
  wallet: WalletContextState
) => {
  const bundlr = new Bundlr(
    BUNDLR_DEVNET_ENDPOINT,
    'solana',
    wallet,
    {
      timeout: 60000,
      providerUrl: ENDPOINT,
    },
  );
  const stringData = JSON.stringify(data);
  const tags = [{ name: "Content-Type", value: "text/json" }];
  // Counts byte stize of stringData
  const size = new Blob([stringData]).size;
  console.log('Byte Size', size);
  // Returns the price needed in the chosen currency to pay for storing the required data size on Arweave.
  const price = await bundlr.getPrice(size);
  // Fund the bundlr with the fund to pay for storage.
  // TODO: Funding every upload is gonna be a very bad user experience. We could ask the user to top up a decent amount so that it never runs out.
  // Our workflow should ideally check if there is enough in the bundlr wallet to pay
  // See https://github.com/metaplex-foundation/metaplex/blob/731953104a199541fd781f415bbe6d95fd59f113/js/packages/cli/src/helpers/upload/arweave-bundle.ts#L546-L561
  await bundlr.fund(price);
  const transaction = bundlr.createTransaction(
    stringData,
    { tags }
  );
  await transaction.sign();
  await transaction.upload();
  const id = transaction.id;
  return `https://arweave.net/${id}`
};
