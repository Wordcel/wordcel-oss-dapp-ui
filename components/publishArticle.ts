import * as anchor from '@project-serum/anchor';
import toast from 'react-hot-toast';
import idl from '@/components/config/devnet-idl.json';
import { PublishArticleRequest } from '@/types/api';
import { SystemProgram, PublicKey } from '@solana/web3.js';
import { uploadBackend, ContentPayload, uploadArweave } from '@/components/upload';

const preflightCommitment = "processed";
const endpoint = 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/'
const programID = new anchor.web3.PublicKey(idl.metadata.address);
const connection = new anchor.web3.Connection(endpoint, preflightCommitment);

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
  signature: Uint8Array,
  id: string | number
) {
  const program = new anchor.Program(idl as anchor.Idl, programID, provider(wallet));
  const publicationSeeds = [Buffer.from("publication"), wallet.publicKey.toBuffer()];

  const existingPublication = await getPublicationAccount(
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
    const newPublicationAccount = await createPublicationAccount(
      publicationSeeds,
      wallet.publicKey,
      program
    );
    if (!newPublicationAccount) return;
    mutPublicationAccount = newPublicationAccount;
    console.log(newPublicationAccount);
  }

  const postSeeds = [Buffer.from("post"), publicationKey.toBuffer(), new anchor.BN(mutPublicationAccount.postNonce).toArrayLike(Buffer)];
  const [postAccount, postBump] = await anchor.web3.PublicKey.findProgramAddress(postSeeds, program.programId);

  toast('Uploading to Arweave...');
  const metadataURI = await uploadArweave(data);
  if (!metadataURI) return;
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
    const verified = await connection.confirmTransaction(txid, preflightCommitment);
    const saved = await publishToServer({
      id: id.toString(),
      arweave_url: metadataURI,
      public_key: wallet.publicKey.toString(),
      signature: signature,
      proof_of_post: postAccount.toBase58(),
    });
    if (verified.value.err === null && saved) return txid;
  }
  catch (e) {
    console.log(e);
    return;
  }
}

async function publishToServer(
  data: PublishArticleRequest
) {
  const request = await fetch('/api/publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return request.ok;
}