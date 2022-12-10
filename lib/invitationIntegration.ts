import toast from 'react-hot-toast';
import * as anchor from '@project-serum/anchor';
import idl from '@/lib/config/invite-idl.json';
import {
  MAINNET_ENDPOINT,
  INVITATION_MAINNET_PROGRAM_ID
} from './config/constants';
import { SystemProgram, PublicKey } from '@solana/web3.js';
import { sendAndConfirmTransaction } from './txConfirmation';
import { AnchorWallet } from '@solana/wallet-adapter-react';

const invitationPrefix = Buffer.from("invite");

const preflightCommitment = "processed";
const programID = INVITATION_MAINNET_PROGRAM_ID;
const connection = new anchor.web3.Connection(MAINNET_ENDPOINT, {
  commitment: preflightCommitment,
  confirmTransactionInitialTimeout: 120000,
});

const provider = (wallet: AnchorWallet) => new anchor.AnchorProvider(
  connection,
  wallet,
  { preflightCommitment }
);

const admin_accounts = [
  // Wordcel Admin
  "8f2yAM5ufEC9WgHYdAxeDgpZqE1B1Q47CciPRZaDN3jc",
  // Shek
  "9M8NddGMCee9ETXXJTGHJHN1vDEqvasMCCirNW94nFNH",
  // Kunal
  "8kgbAgt8oedfprQ9LWekUh6rbY264Nv75eunHPpkbYGX",
  // Paarug
  "Gs3xD3V6We8H62pM9fkufKs644KWz1pts4EUn3bAR6Yb",
  // Vijay
  "9psZBS7GHNrFxADh93Gv1Qnr9TTCP9GAdfrvDFzgLJUf",
];


export const isAdmin = (user: PublicKey): boolean =>
  admin_accounts.includes(user.toBase58());

export const getInviteAccount = async (user_wallet: AnchorWallet) => {
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(user_wallet));
  const invite_key = await getInviteKey(user_wallet.publicKey);
  return await program.account.invite.fetch(invite_key);
}

async function adminInvite(
  from_admin: AnchorWallet,
  to_user: PublicKey,
) {
  toast.loading('Loading configurations');
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(from_admin));
  const toInviteKey = await getInviteKey(to_user);
  toast.dismiss();
  const tx = await program.methods.initialize()
    .accounts({
      inviteAccount: toInviteKey,
      authority: to_user,
      payer: from_admin.publicKey,
      systemProgram: SystemProgram.programId
    }).transaction();
  const confirmed = await sendAndConfirmTransaction(
    connection,
    tx,
    from_admin
  );
  if (!confirmed) throw new Error('Transaction Failed');
  return toInviteKey;
}

export async function getInviteKey(public_key: PublicKey) {
  const seed = [invitationPrefix, public_key.toBuffer()];
  const [account, _] = await anchor.web3.PublicKey.findProgramAddress(seed, programID);
  return account;
};

export async function sendInvite(
  from_user: AnchorWallet,
  to: PublicKey,
) {
  toast.loading('Loading configurations');
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(from_user));
  const fromInviteKey = await getInviteKey(from_user.publicKey);
  const toInviteKey = await getInviteKey(to);
  toast.dismiss();

  // Initialize directly if an admin is sending invites
  if (isAdmin(from_user.publicKey)) {
    return await adminInvite(from_user, to);
  }

  // Should send invites
  const tx = await program.methods.sendInvite()
    .accounts({
      inviteAccount: fromInviteKey,
      toInviteAccount: toInviteKey,
      to: to,
      authority: from_user.publicKey,
      systemProgram: SystemProgram.programId
    }).transaction();

  const confirmed = await sendAndConfirmTransaction(
    connection,
    tx,
    from_user
  );
  if (!confirmed) throw new Error('Transaction Failed');
  return toInviteKey;
};
