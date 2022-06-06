import toast from 'react-hot-toast';
import * as anchor from '@project-serum/anchor';
import idl from '@/components/config/invite-idl.json';
import { ENDPOINT } from './config/constants';
import { SystemProgram, PublicKey } from '@solana/web3.js';

const invitationPrefix = Buffer.from("invite");

const preflightCommitment = "processed";
const programID = new anchor.web3.PublicKey(idl.metadata.address);
const connection = new anchor.web3.Connection(ENDPOINT, preflightCommitment);

const provider = (wallet: anchor.Wallet) => new anchor.Provider(
  connection,
  wallet,
  { preflightCommitment }
);

export async function getInviteKey(public_key: PublicKey) {
  const seed = [invitationPrefix, public_key.toBuffer()];
  const [account, _] = await anchor.web3.PublicKey.findProgramAddress(seed, programID);
  return account;
};

export async function sendInvite(
  from_user: anchor.Wallet,
  to: PublicKey,
) {
  toast.loading('Loading configurations');
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(from_user));
  const fromInviteKey = await getInviteKey(from_user.publicKey);
  const toInviteKey = await getInviteKey(to);
  toast.dismiss();
  const tx = await program.methods.sendInvite()
    .accounts({
      inviteAccount: fromInviteKey,
      toInviteAccount: toInviteKey,
      to: to,
      authority: from_user.publicKey,
      systemProgram: SystemProgram.programId
    }).rpc();
  const confirmed = await connection.confirmTransaction(tx);
  if (confirmed.value.err !== null) {
    throw new Error('Transaction Failed');
  }
  return toInviteKey;
};
