import * as anchor from '@project-serum/anchor';
import toast from 'react-hot-toast';
import idl from '@/components/config/devnet-idl.json';
import { PublishArticleRequest } from '@/types/api';
import { SystemProgram, PublicKey } from '@solana/web3.js';
import { ContentPayload } from '@/components/upload';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { uploadBundle } from '@/components/uploadBundlr';
import { ENDPOINT } from './config/constants';

const preflightCommitment = "processed";
const programID = new anchor.web3.PublicKey(idl.metadata.address);
const connection = new anchor.web3.Connection(ENDPOINT, preflightCommitment);

const provider = (wallet: anchor.Wallet) => new anchor.Provider(
  connection,
  wallet,
  { preflightCommitment: preflightCommitment }
);

export async function getPublicationAccount(
  publicationSeeds: Buffer[],
  program: anchor.Program
) {
  return await anchor.web3.PublicKey.findProgramAddress(
    publicationSeeds,
    program.programId
  );
}

async function createPublicationAccount(
  publicationSeeds: Buffer[],
  user: PublicKey,
  program: anchor.Program
) {
  const [publicationAccount, publicationBump] = await anchor.web3.PublicKey.findProgramAddress(
    publicationSeeds,
    program.programId
  );
  await program.rpc.initialize(publicationBump, {
    accounts: {
      publication: publicationAccount,
      user: user,
      systemProgram: SystemProgram.programId,
    }
  });
  return publicationAccount;
}

export async function publishPost(
  data: ContentPayload,
  wallet: anchor.Wallet,
  adapterWallet: WalletContextState,
  signature: Uint8Array,
  id?: string | number,
  getResponse?: boolean,
  published_post = ''
) {
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const publicationSeeds = [Buffer.from("publication"), wallet.publicKey.toBuffer()];
  const existingPublication = await getPublicationAccount(
    publicationSeeds,
    program
  );
  const publicationKey = existingPublication[0];
  let mutPublicationAccount;
  toast.dismiss();
  try {
    const publicationAccount = await program.account.publication.fetch(publicationKey);
    console.log(publicationAccount);
    mutPublicationAccount = publicationAccount;
  } catch (e) {
    toast('Publication account does not exist');
    const newPublicationAccount = await createPublicationAccount(
      publicationSeeds,
      wallet.publicKey,
      program
    );
    if (!newPublicationAccount) {
      throw new Error(`Publication account creation failed`);
    };
    mutPublicationAccount = newPublicationAccount;
    console.log(newPublicationAccount);
  }

  const postSeeds = [Buffer.from("post"), publicationKey.toBuffer(), new anchor.BN(mutPublicationAccount.postNonce).toArrayLike(Buffer)];
  const [postAccount, postBump] = await anchor.web3.PublicKey.findProgramAddress(postSeeds, program.programId);
  toast.loading('Uploading');
  const metadataURI = await uploadBundle(
    data,
    adapterWallet
  );
  toast.dismiss();
  if (!metadataURI) {
    toast.error('Upload failed');
    throw new Error('Upload failed');
  };
  toast.success('Uploaded');
  console.log(`Arweave URI: ${metadataURI}`);
  let txid;
  if (published_post) {
    txid = await program.rpc.updatePost(metadataURI, {
      accounts: {
        post: new PublicKey(published_post),
        publication: publicationKey,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }
    });
    console.log(`update tx: ${txid}`);
  } else {
    const tx = program.transaction.createPost(postBump, metadataURI, {
      accounts: {
        post: postAccount,
        publication: publicationKey,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
    });
    const { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;
    const signedTx = await wallet.signTransaction(tx);
    txid = await connection.sendRawTransaction(signedTx.serialize());
  }
  try {
    if (!txid) {
      throw new Error('Transaction creation failed');
    };
    const confirmation = connection.confirmTransaction(txid, preflightCommitment);
    toast.promise(confirmation, {
      loading: 'Confirming Transaction',
      success: 'Article Published',
      error: 'Transaction Failed'
    });
    const verified = await confirmation;
    if (verified.value.err !== null) return;
    toast.loading('Saving');
    const saved = await publishToServer({
      id: id?.toString(),
      arweave_url: metadataURI,
      public_key: wallet.publicKey.toString(),
      signature: signature,
      proof_of_post: published_post || postAccount.toBase58(),
    });
    toast.dismiss();
    if (saved && !getResponse) return txid;
    if (saved && getResponse) return saved;
  } catch (e) {
    console.log(e);
    return;
  }
}

async function publishToServer(
  data: PublishArticleRequest
) {
  const request = await fetch(
    data.id ? '/api/publish' : '/api/publish/new',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const response = await request.json();
  return response;
}


export async function initializeSubscriberAccount(
  wallet: anchor.Wallet,
) {
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const subscriberSeeds = [Buffer.from("subscriber"), wallet.publicKey.toBuffer()];
  const [subscriberAccount, subscriptionBump] = await anchor.web3.PublicKey.findProgramAddress(
    subscriberSeeds,
    program.programId
  );
  const txid = await program.rpc.initializeSubscriber(subscriptionBump, {
    accounts: {
      subscriber: subscriberAccount,
      user: wallet.publicKey,
      systemProgram: SystemProgram.programId
    }
  });
  console.log(`Subscription Account Creation: ${txid}`);
  return subscriberAccount;
};

export async function subscribeToPublication(
  wallet: anchor.Wallet,
  publicationOwner: PublicKey
) {
  // WIP
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const subscriberSeeds = [Buffer.from("subscriber"), wallet.publicKey.toBuffer()];
  const publicationSeeds = [Buffer.from("publication"), publicationOwner.toBuffer()];
  const [subscriberAccount, subscriptionBump] = await anchor.web3.PublicKey.findProgramAddress(
    subscriberSeeds,
    program.programId
  );
  const [publicationAccount] = await anchor.web3.PublicKey.findProgramAddress(
    publicationSeeds,
    program.programId
  );
  // const subcriptionSeeds = [Buffer.from("subcription"), subscriberAccount.toBuffer(), ]
  let mutSubscriberAccount = subscriberAccount;
  if (!mutSubscriberAccount) {
    toast('Subscriber account does not exist');
    try {
      const newsubscriberAccount = await initializeSubscriberAccount(wallet);
      mutSubscriberAccount = newsubscriberAccount;
    } catch (e) {
      console.error(e);
      toast.error('Subscriber account creation failed');
    }
  }
  const txid = await program.rpc.initializeSubscription(subscriptionBump, {
    accounts: {
      subscriber: mutSubscriberAccount,
      authority: wallet.publicKey,
      publication: publicationAccount,
      systemProgram: SystemProgram.programId
    }
  });
}
