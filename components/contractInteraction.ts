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
  const [subscriberKey, subscriptionBump] = await anchor.web3.PublicKey.findProgramAddress(
    subscriberSeeds,
    program.programId
  );
  const txid = await program.rpc.initializeSubscriber(subscriptionBump, {
    accounts: {
      subscriber: subscriberKey,
      user: wallet.publicKey,
      systemProgram: SystemProgram.programId
    }
  });
  console.log(`Subscriber Account Creation: ${txid}`);
  return subscriberKey;
};

export async function getIfSubscribed(
  wallet: anchor.Wallet,
  publicationOwner: PublicKey
) {
  try {
    const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
    const subscriberSeeds = [Buffer.from("subscriber"), wallet.publicKey.toBuffer()];
    const [subscriberKey] = await anchor.web3.PublicKey.findProgramAddress(
      subscriberSeeds,
      program.programId
    );
    console.log(`Subscriber Key: ${subscriberKey}`);

    const subscriberAccount = await program.account.subscriber.fetch(subscriberKey);
    console.log(subscriberAccount);
    if (!subscriberAccount) return false;
    const subcriptionSeeds = [Buffer.from("subscription"), subscriberKey.toBuffer(), new anchor.BN(subscriberAccount.subscriptionNonce).toArrayLike(Buffer)];
    const [subscriptionKey] = await anchor.web3.PublicKey.findProgramAddress(
      subcriptionSeeds,
      program.programId
    );
    console.log(`Subscription Key" ${subscriptionKey}`)
    console.log('it works till here')

    const subscriptionAccount = await program.account.subscription.fetch(subscriptionKey);
    console.log(subscriptionAccount);
    if (!subscriptionAccount) return false;
  } catch (e) {
    console.log(e)
    return false;
  }
}

export async function subscribeToPublication(
  wallet: anchor.Wallet,
  publicationOwner: PublicKey,
  setSubscribed: (subscribed: boolean) => void
) {
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const subscriberSeeds = [Buffer.from("subscriber"), wallet.publicKey.toBuffer()];
  const publicationSeeds = [Buffer.from("publication"), publicationOwner.toBuffer()];
  const [subscriberKey] = await anchor.web3.PublicKey.findProgramAddress(
    subscriberSeeds,
    program.programId
  );

  let subscriberAccount;
  try {
    subscriberAccount = await program.account.subscriber.fetch(subscriberKey);
  } catch (e) {
    console.log('Subscriber account does not exist');
    const newSubscriberAccount = await initializeSubscriberAccount(wallet);
    if (!newSubscriberAccount) {
      toast.error('Subscriber account creation failed');
      throw new Error(`Subscriber account creation failed`);
    }
    subscriberAccount = newSubscriberAccount;
  }
  const [publicationKey] = await anchor.web3.PublicKey.findProgramAddress(
    publicationSeeds,
    program.programId
  );
  const subcriptionSeeds = [Buffer.from("subscription"), subscriberKey.toBuffer(), new anchor.BN(subscriberAccount.subscriptionNonce).toArrayLike(Buffer)];
  const [subscriptionKey, subscriptionBump] = await anchor.web3.PublicKey.findProgramAddress(
    subcriptionSeeds,
    program.programId
  );

  try {
    const subscriptionAccount = await program.account.subscription.fetch(subscriptionKey);
    console.log(subscriptionAccount);
  } catch {
    console.log('Subscription account does not exist')
    const tx = await program.transaction.initializeSubscription(subscriptionBump, {
      accounts: {
        subscriber: subscriberKey,
        subscription: subscriptionKey,
        authority: wallet.publicKey,
        publication: publicationKey,
        systemProgram: SystemProgram.programId
      }
    });
    const { blockhash } = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = wallet.publicKey;
    const signedTx = await wallet.signTransaction(tx);
    const txid = await connection.sendRawTransaction(signedTx.serialize());
    if (!txid) {
      throw new Error('Transaction creation failed');
    };
    const confirmation = connection.confirmTransaction(txid, preflightCommitment);
    toast.promise(confirmation, {
      loading: 'Confirming Transaction',
      success: 'Subscribed',
      error: 'Transaction Failed'
    });
    const verified = await confirmation;
    if (verified.value.err !== null) {
      throw new Error('Transaction failed')
    };
    // remove the stuff below this once contract is fixed
    setSubscribed(true);
    const existingSubscriptionsJSON = localStorage.getItem('subscriptions');
    if (!existingSubscriptionsJSON) {
      localStorage.setItem('subscriptions', JSON.stringify([publicationOwner]))
    } else {
      const data = JSON.parse(existingSubscriptionsJSON);
      data.push(publicationOwner);
      localStorage.setItem('subscriptions', JSON.stringify(data));
    }
  }
}
