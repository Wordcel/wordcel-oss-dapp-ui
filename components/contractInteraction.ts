import * as anchor from '@project-serum/anchor';
import randombytes from 'randombytes';
import toast from 'react-hot-toast';
import idl from '@/components/config/wordcel-idl.json';
import { SystemProgram, PublicKey } from '@solana/web3.js';
import { ContentPayload } from '@/components/upload';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { uploadBundle } from '@/components/uploadBundlr';
import {
  MAINNET_ENDPOINT,
  WORDCEL_MAINNET_PROGRAM_ID,
  INVITATION_MAINNET_PROGRAM_ID
} from './config/constants';
import {
  publishToServer,
  updateConnectionServer,
  getProfileHash
} from '@/components/networkRequests';
import { sendAndConfirmTransaction } from './txConfirmation';

const preflightCommitment = "processed";
const programID = WORDCEL_MAINNET_PROGRAM_ID;
const invitationProgramID = INVITATION_MAINNET_PROGRAM_ID;
const connection = new anchor.web3.Connection(MAINNET_ENDPOINT, {
  commitment: preflightCommitment,
  confirmTransactionInitialTimeout: 120000,
});

const provider = (wallet: anchor.Wallet) => new anchor.AnchorProvider(
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
};

export async function createFreshProfile (
  wallet: anchor.Wallet
) {
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const profileHash = randombytes(32);
  const profileSeeds = [Buffer.from("profile"), profileHash];
  const inviteSeeds = [Buffer.from("invite"), wallet.publicKey.toBuffer()];
  const [profileKey] = await anchor.web3.PublicKey.findProgramAddress(
    profileSeeds,
    program.programId
  );
  const [inviteKey] = await anchor.web3.PublicKey.findProgramAddress(
    inviteSeeds,
    invitationProgramID
  );
  const transaction = await program.methods.initialize(profileHash).accounts({
    profile: profileKey,
    invitation: inviteKey,
    user: wallet.publicKey,
    systemProgram: SystemProgram.programId,
    invitationProgram: invitationProgramID
  }).transaction();
  const confirmed = await sendAndConfirmTransaction(
    connection,
    transaction,
    wallet
  );
  if (!confirmed) return;
  return profileHash.toString('base64');
};

export async function publishPost(
  data: ContentPayload,
  wallet: anchor.Wallet,
  adapterWallet: WalletContextState,
  signature: Uint8Array,
  id?: string | number,
  getResponse?: boolean,
  published_post = '',
  parentDigest?: string
) {
  toast.loading('Loading configurations');
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const existingHash = await getProfileHash(wallet.publicKey.toBase58());
  const profileHash = Buffer.from(existingHash, 'base64');

  const profileSeeds = [Buffer.from("profile"), profileHash];
  const profileKeyAndBump = await getProfileKeyAndBump(
    profileSeeds,
    program
  );
  const profileKey = profileKeyAndBump[0];

  try {
    const profileAccount = await program.account.profile.fetch(profileKey);
    console.log(profileAccount);
  } catch (e) {
    toast('Profile does not exist');
    return;
  }

  const postHash = randombytes(32);
  const postSeeds = [Buffer.from("post"), postHash];
  const [postAccount] = await anchor.web3.PublicKey.findProgramAddress(postSeeds, program.programId);
  toast.dismiss();

  toast.loading('Uploading');
  let metadataURI: (string|undefined) = '';
  try {
    metadataURI = await uploadBundle(
      data,
      adapterWallet,
      postAccount.toBase58(),
      profileKey.toBase58(),
      parentDigest
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

  let transaction;
  if (published_post) {
    transaction = await program.methods.updatePost(metadataURI).accounts({
      post: new PublicKey(published_post),
      profile: profileKey,
      authority: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }).transaction();
  } else {
    transaction = await program.methods.createPost(metadataURI, postHash).accounts({
      post: postAccount,
      profile: profileKey,
      authority: wallet.publicKey,
      systemProgram: SystemProgram.programId
    }).transaction();
  }

  const txid = await sendAndConfirmTransaction(
    connection,
    transaction,
    wallet,
    false
  );

  if (!txid) {
    throw new Error('Transaction creation failed');
  }

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
  toast.loading('Loading configurations');
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const profileKey = await getProfileKey(profileOwner, wallet);
  if (!profileKey) return;
  const connectionSeeds = [Buffer.from("connection"), wallet.publicKey.toBuffer(), profileKey.toBuffer()];
  const [connectionKey] = await anchor.web3.PublicKey.findProgramAddress(
    connectionSeeds,
    program.programId
  );
  toast.dismiss();

  const transaction = await program.methods.initializeConnection().accounts({
    connection: connectionKey,
    profile: profileKey,
    authority: wallet.publicKey,
    systemProgram: SystemProgram.programId
  }).transaction();
  const txid = await sendAndConfirmTransaction(
    connection,
    transaction,
    wallet,
    false
  );
  if (!txid) throw new Error('Transaction creation failed');

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
  toast.loading('Loading configurations');
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const profileKey = await getProfileKey(profileOwner, wallet);
  if (!profileKey) return;

  const connectionSeeds = [Buffer.from("connection"), wallet.publicKey.toBuffer(), profileKey.toBuffer()];
  const [connectionKey] = await anchor.web3.PublicKey.findProgramAddress(
    connectionSeeds,
    program.programId
  );
  toast.dismiss();

  const transaction = await program.methods.closeConnection().accounts({
    connection: connectionKey,
    authority: wallet.publicKey,
    profile: profileKey,
    systemProgram: SystemProgram.programId
  }).transaction();
  const txid = await sendAndConfirmTransaction(
    connection,
    transaction,
    wallet,
    false
  );
  if (!txid) throw new Error('Transaction creation failed');

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