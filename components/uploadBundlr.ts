import Bundlr from '@bundlr-network/client';
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey
} from "@solana/web3.js";
import { ContentPayload } from '@/components/upload';
import { UPLOAD_PAYMENT_ENDPOINT } from '@/components/config/constants';

const connection = new Connection(
  UPLOAD_PAYMENT_ENDPOINT,
  'confirmed',
);

export async function uploadBundle(data: ContentPayload): Promise<string | undefined> {
  const bundlr = new Bundlr(
    'https://node1.bundlr.network/',
    'solana',
    undefined,
    {
      timeout: 60000,
      providerUrl: UPLOAD_PAYMENT_ENDPOINT,
    },
  )
  const tags = [{ name: "Content-Type", value: "text/json" }];
  const stringData = JSON.stringify(data);
  // Returns the price needed in the chosen currency to pay for storing 10000 bytes on Arweave.
  const price = await bundlr.getPrice(10000);
  console.log(price);
  console.log(bundlr);
  // Fund the bundlr with the fund to pay for storage.
  // TODO: Funding every upload is gonna be a very bad user experience. We could ask the user to top up a decent amount so that it never runs out.
  // Our workflow should ideally check if there is enough in the bundlr wallet to pay
  // See https://github.com/metaplex-foundation/metaplex/blob/731953104a199541fd781f415bbe6d95fd59f113/js/packages/cli/src/helpers/upload/arweave-bundle.ts#L546-L561
  return;
  // await bundlr.fund(price);

  // const transaction = bundlr.createTransaction(stringData, {tags});
  // await transaction.sign();
  // await transaction.upload();
  // const id = transaction.id;
  // return `https://arweave.net/${id}`
}
