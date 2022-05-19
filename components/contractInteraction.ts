import * as anchor from '@project-serum/anchor';
import randombytes from 'randombytes';
import toast from 'react-hot-toast';
import idl from '@/components/config/devnet-idl.json';
import { AddPublicationHash, PublishArticleRequest, Subscribe } from '@/types/api';
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
  publicationHash: Buffer,
  user: PublicKey,
  program: anchor.Program
) {
  const [publicationKey, publicationBump] = await anchor.web3.PublicKey.findProgramAddress(
    publicationSeeds,
    program.programId
  );
  await program.rpc.initialize(publicationBump, publicationHash, {
    accounts: {
      publication: publicationKey,
      user: user,
      systemProgram: SystemProgram.programId,
    }
  });
  return publicationKey;
}

async function getPublicationHash (
  public_key: string
) {
  const request = await fetch(`/api/user/get/${public_key}`);
  const response = await request.json();
  console.log(response);
  return response.user.publication_hash;
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
  toast.loading('Loading configurations');
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const existingHash = await getPublicationHash(wallet.publicKey.toBase58());
  const publicationHash = existingHash ? Buffer.from(existingHash, 'base64') : randombytes(32);

  const publicationSeeds = [Buffer.from("publication"), publicationHash];
  const existingPublication = await getPublicationAccount(
    publicationSeeds,
    program
  );
  const publicationKey = existingPublication[0];
  toast.dismiss();
  try {
    const publicationAccount = await program.account.publication.fetch(publicationKey);
    console.log(publicationAccount);
  } catch (e) {
    toast('Publication account does not exist');
    const newPublicationAccount = await createPublicationAccount(
      publicationSeeds,
      publicationHash,
      wallet.publicKey,
      program
    );
    if (!newPublicationAccount) {
      throw new Error(`Publication account creation failed`);
    };
    if (!existingHash) {
      const publication_hash_req = await addPublicationHash({
        public_key: wallet.publicKey.toBase58(),
        signature: signature,
        publication_hash: publicationHash.toString('base64')
      });
      if (!publication_hash_req.user) {
        throw new Error(`Publication hash save failed`);
      }
    }
    console.log(newPublicationAccount);
  }

  const postHash = randombytes(32);
  const postSeeds = [Buffer.from("post"), postHash];
  const [postAccount, postBump] = await anchor.web3.PublicKey.findProgramAddress(postSeeds, program.programId);

  toast.loading('Uploading');
  let metadataURI = '';
  try {
    metadataURI = await uploadBundle(
      data,
      adapterWallet
    );
  } catch (e: any) {
    console.log(e);
  }
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
    const tx = program.transaction.createPost(postBump, metadataURI, postHash, {
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

async function addPublicationHash (
  data: AddPublicationHash
) {
  const request = await fetch(
    '/api/user/create/publication',
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

async function updateSubscriptionServer(
  data: Subscribe,
  cancel = false
) {
  const request = await fetch(
    cancel ? '/api/subscription/cancel' : '/api/subscription/new',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const response = await request.json();
  return response;
};

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
  publicationOwner: string,
  returnResponse = false
) {
  const request = await fetch(`/api/subscription/get/${wallet.publicKey.toBase58()}/${publicationOwner}`);
  if (!returnResponse) return request.ok;
  const response = await request.json();
  return response;
}

export async function subscribeToPublication(
  wallet: anchor.Wallet,
  publicationOwner: PublicKey,
  setSubscribed: (subscribed: boolean) => void,
  signature: Uint8Array
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
    success: 'Transaction Confirmed',
    error: 'Transaction Failed'
  });
  const verified = await confirmation;
  if (verified.value.err !== null) {
    throw new Error('Transaction failed')
  };
  toast.loading('Saving')
  const saved = await updateSubscriptionServer({
    account: subscriptionKey.toBase58(),
    publication_owner: publicationOwner.toBase58(),
    public_key: wallet.publicKey.toString(),
    signature: signature,
  });
  toast.dismiss();
  if (saved.success) {
    setSubscribed(true);
    toast.success('Subscribed');
  }
}

export async function cancelSubscription(
  wallet: anchor.Wallet,
  publicationOwner: PublicKey,
  subscriptionKey: PublicKey,
  setSubscribed: (subscribed: boolean) => void,
  signature: Uint8Array
) {
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const subscriberSeeds = [Buffer.from("subscriber"), wallet.publicKey.toBuffer()];
  const [subscriberKey] = await anchor.web3.PublicKey.findProgramAddress(
    subscriberSeeds,
    program.programId
  );
  const tx = await program.transaction.cancelSubscription({
    accounts: {
      subscriber: subscriberKey,
      subscription: subscriptionKey,
      authority: wallet.publicKey,
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
    success: 'Transaction Confirmed',
    error: 'Transaction Failed'
  });
  const verified = await confirmation;
  if (verified.value.err !== null) {
    throw new Error('Transaction failed')
  };
  toast.loading('Saving');
  const saved = await updateSubscriptionServer({
    account: subscriptionKey.toBase58(),
    publication_owner: publicationOwner.toBase58(),
    public_key: wallet.publicKey.toString(),
    signature: signature,
  }, true);
  toast.dismiss();
  if (saved.success) {
    setSubscribed(false);
    toast.success('Unsubscribed');
  } else {
    toast.error('Subscription cancellation failed');
  }
}