import * as anchor from '@project-serum/anchor';
import randombytes from 'randombytes';
import toast from 'react-hot-toast';
import idl from '@/components/config/devnet-idl.json';
import { SystemProgram, PublicKey } from '@solana/web3.js';
import { ContentPayload } from '@/components/upload';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { uploadBundle } from '@/components/uploadBundlr';
import { ENDPOINT } from './config/constants';
import {
  addProfileHash,
  publishToServer,
  updateConnectionServer,
  getProfileHash
} from '@/components/networkRequests';

const preflightCommitment = "processed";
const programID = new anchor.web3.PublicKey(idl.metadata.address);
const connection = new anchor.web3.Connection(ENDPOINT, preflightCommitment);

const provider = (wallet: anchor.Wallet) => new anchor.Provider(
  connection,
  wallet,
  { preflightCommitment }
);

export async function getProfileKeyAndBump(
  profileSeeds: Buffer[],
  program: anchor.Program
) {
  return await anchor.web3.PublicKey.findProgramAddress(
    profileSeeds,
    program.programId
  );
}

async function createProfileAccount(
  profileSeeds: Buffer[],
  profileHash: Buffer,
  user: PublicKey,
  program: anchor.Program
) {
  const [profileKey] = await anchor.web3.PublicKey.findProgramAddress(
    profileSeeds,
    program.programId
  );
  await program.rpc.initialize(profileHash, {
    accounts: {
      profile: profileKey,
      user: user,
      systemProgram: SystemProgram.programId,
    }
  });
  return profileKey;
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
  const existingHash = await getProfileHash(wallet.publicKey.toBase58());
  const profileHash = existingHash ? Buffer.from(existingHash, 'base64') : randombytes(32);

  const profileSeeds = [Buffer.from("profile"), profileHash];
  const profileKeyAndBump = await getProfileKeyAndBump(
    profileSeeds,
    program
  );
  const profileKey = profileKeyAndBump[0];
  toast.dismiss();

  try {
    const profileAccount = await program.account.profile.fetch(profileKey);
    console.log(profileAccount);
  } catch (e) {
    toast('Profile does not exist, creating one');
    const newProfileAccount = await createProfileAccount(
      profileSeeds,
      profileHash,
      wallet.publicKey,
      program
    );
    if (!newProfileAccount) {
      throw new Error(`Profile creation failed`);
    };
    if (!existingHash) {
      const profile_hash_req = await addProfileHash({
        public_key: wallet.publicKey.toBase58(),
        signature: signature,
        profile_hash: profileHash.toString('base64')
      });
      if (!profile_hash_req.user) {
        throw new Error(`Profile hash save failed`);
      }
    }
    console.log(newProfileAccount);
  }

  const postHash = randombytes(32);
  const postSeeds = [Buffer.from("post"), postHash];
  const [postAccount] = await anchor.web3.PublicKey.findProgramAddress(postSeeds, program.programId);

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
        profile: profileKey,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      }
    });
    console.log(`update tx: ${txid}`);
  } else {
    txid = await program.rpc.createPost(metadataURI, postHash, {
      accounts: {
        post: postAccount,
        profile: profileKey,
        authority: wallet.publicKey,
        systemProgram: SystemProgram.programId
      },
    });
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
    if (verified.value.err !== null) {
      throw new Error('Transaction confirmation failed');
    };
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

export async function getProfileKey (
  profileOwner: PublicKey,
  wallet: anchor.Wallet
) {
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const existingHash = await getProfileHash(profileOwner.toBase58());
  if (!existingHash) {
    toast.error('Profile hash not found');
    return;
  }
  const profileSeeds = [Buffer.from("profile"), Buffer.from(existingHash, 'base64')];
  const [profileKey] = await anchor.web3.PublicKey.findProgramAddress(
    profileSeeds,
    program.programId
  );
  return profileKey;
}

export async function createConnection (
  wallet: anchor.Wallet,
  profileOwner: PublicKey,
  setConnected: (connected: boolean) => void,
  signature: Uint8Array
) {
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const profileKey = await getProfileKey(profileOwner, wallet);
  if (!profileKey) return;

  const connectionSeeds = [Buffer.from("connection"), wallet.publicKey.toBuffer(), profileKey.toBuffer()];
  const [connectionKey] = await anchor.web3.PublicKey.findProgramAddress(
    connectionSeeds,
    program.programId
  );

  const txid = await program.rpc.initializeConnection({
    accounts: {
      connection: connectionKey,
      profile: profileKey,
      authority: wallet.publicKey,
      systemProgram: SystemProgram.programId
    }
  });
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
  const saved = await updateConnectionServer({
    account: connectionKey.toBase58(),
    profile_owner: profileOwner.toBase58(),
    public_key: wallet.publicKey.toString(),
    signature: signature,
  });
  toast.dismiss();
  if (saved.success) {
    setConnected(true);
    toast.success('Connection created');
  }
}

export async function closeConnection (
  wallet: anchor.Wallet,
  profileOwner: PublicKey,
  setConnected: (connected: boolean) => void,
  signature: Uint8Array
) {
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const profileKey = await getProfileKey(profileOwner, wallet);
  if (!profileKey) return;

  const connectionSeeds = [Buffer.from("connection"), wallet.publicKey.toBuffer(), profileKey.toBuffer()];
  const [connectionKey] = await anchor.web3.PublicKey.findProgramAddress(
    connectionSeeds,
    program.programId
  );
  const txid = await program.rpc.closeConnection({
    accounts: {
      connection: connectionKey,
      authority: wallet.publicKey,
      profile: profileKey,
      systemProgram: SystemProgram.programId
    }
  });
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
  const saved = await updateConnectionServer({
    account: connectionKey.toBase58(),
    profile_owner: profileOwner.toBase58(),
    public_key: wallet.publicKey.toString(),
    signature: signature,
  }, true);
  toast.dismiss();
  if (saved.success) {
    setConnected(false);
    toast.success('Connection cancelled');
  } else {
    toast.error('Connection cancellation failed');
  }
}