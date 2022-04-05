import idl from '@/components/config/devnet-idl.json';
import * as anchor from '@project-serum/anchor';
import { uploadArweave } from "./upload";
import { ContentPayload } from '@/components/upload';
import { SystemProgram, PublicKey } from '@solana/web3.js';
import toast from 'react-hot-toast';

const preflightCommitment = "processed";
const endpoint = 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/'
const programID = new anchor.web3.PublicKey(idl.metadata.address);
const connection = new anchor.web3.Connection(endpoint, preflightCommitment);

const provider = (wallet: anchor.Wallet) => new anchor.Provider(
  connection,
  wallet,
  { preflightCommitment: preflightCommitment }
);

export async function getPublication(
  publicationSeeds: Buffer[],
  program: anchor.Program
) {
  return await anchor.web3.PublicKey.findProgramAddress(
    publicationSeeds,
    program.programId
  );
}

async function createPublication(
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
  wallet: anchor.Wallet
) {
  console.log(idl);
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const publicationSeeds = [Buffer.from("publication"), wallet.publicKey.toBuffer()];

  const existingPublication = await getPublication(
    publicationSeeds,
    program
  );
  const publicationKey = existingPublication[0];
  let mutPublicationAccount;

  try {
    const publicationAccount = await program.account.publication.fetch(publicationKey);
    console.log(publicationAccount);
    mutPublicationAccount = publicationAccount;
  } catch (e) {
    console.log('Publication account does not exist');
    const newPublicationAccount = await createPublication(
      publicationSeeds,
      wallet.publicKey,
      program
    );
    mutPublicationAccount = newPublicationAccount;
    console.log(newPublicationAccount);
  }

  const postSeeds = [Buffer.from("post"), publicationKey.toBuffer(), new anchor.BN(mutPublicationAccount.postNonce).toArrayLike(Buffer)];
  const [postAccount, postBump] = await anchor.web3.PublicKey.findProgramAddress(postSeeds, program.programId);
  toast('Uploading to Arweave...');
  const metadataURI = await uploadArweave(data);
  console.log(`Arweave URI: ${metadataURI}`);
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
  try {
    const txid = await connection.sendRawTransaction(signedTx.serialize());
    if (!txid) return;
    const verified = connection.confirmTransaction(txid, preflightCommitment);
    return verified;
  }
  catch (e) {
    console.log(e);
    return;
  }
}
