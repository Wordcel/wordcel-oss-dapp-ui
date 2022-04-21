import Bundlr from '@bundlr-network/client';
import { ENDPOINT } from '@/components/config/constants';
import { ContentPayload } from '@/components/upload';
import { Keypair, PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';


async function requestAirdrop(publicKey: PublicKey) {
  const connection = new Connection(ENDPOINT, 'confirmed');
  return connection.requestAirdrop(
    publicKey,
    LAMPORTS_PER_SOL,
  );
}

export const uploadBundle = async (data: ContentPayload) => {
  const walletKeyPair = Keypair.generate();
  const airdropped = await requestAirdrop(walletKeyPair.publicKey);
  if (!airdropped) return;
  const bundlr = new Bundlr(
    'https://devnet.bundlr.network',
    'solana',
    walletKeyPair,
    {
      timeout: 60000,
      providerUrl: ENDPOINT,
    },
  )
  const tags = [{ name: "Content-Type", value: "text/json" }];
  // Returns the price needed in the chosen currency to pay for storing 10000 bytes on Arweave.
  const price = await bundlr.getPrice(10000);
  console.log(bundlr)
  // Fund the bundlr with the fund to pay for storage.
  // TODO: Funding every upload is gonna be a very bad user experience. We could ask the user to top up a decent amount so that it never runs out.
  // Our workflow should ideally check if there is enough in the bundlr wallet to pay
  // See https://github.com/metaplex-foundation/metaplex/blob/731953104a199541fd781f415bbe6d95fd59f113/js/packages/cli/src/helpers/upload/arweave-bundle.ts#L546-L561
  await bundlr.fund(price);
  const transaction = bundlr.createTransaction(
    JSON.stringify(data),
    {tags}
  );
  await transaction.sign();
  await transaction.upload();
  const id = transaction.id;
  return `https://arweave.net/${id}`
}
