import {
  PublicKey,
  Transaction,
  Connection,
  Keypair,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  Token,
} from '@solana/spl-token';
import { toast } from 'react-hot-toast';
import { USDC_MINT } from './config/constants';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { addTip } from './networkRequests';


export const sendSPL = async (
  wallet: WalletContextState,
  toWalletAddress: string,
  amount: number,
  decimals = 6,
  mint = USDC_MINT
): Promise<boolean | undefined> => {

  if (!wallet.publicKey || !wallet.signTransaction || wallet === null) {
    toast('Please connect your wallet');
    return
  };

  // Construct wallet keypairs
  const fromWallet = Keypair.generate();
  const toWallet = new PublicKey(toWalletAddress);
  const connection = new Connection('https://api.mainnet-beta.solana.com', {
    confirmTransactionInitialTimeout: 120000,
  });

  // Construct my token class
  const SPL_pubkey = new PublicKey(mint);
  const SPL_Token = new Token(
    connection,
    SPL_pubkey,
    TOKEN_PROGRAM_ID,
    fromWallet,
  );

  let fromTokenAccount;

  try {
    fromTokenAccount = await SPL_Token.getOrCreateAssociatedAccountInfo(wallet.publicKey);
    // Create associated token accounts for the recipient if they don't exist yet
  } catch (error: any) {
    toast.error(`${error.message} for SPL token of the sender`);
    return;
  }

  const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
    SPL_Token.associatedProgramId,
    SPL_Token.programId,
    SPL_pubkey,
    toWallet,
  );

  const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);

  const transaction = new Transaction();

  if (receiverAccount === null) {
    transaction.add(
      Token.createAssociatedTokenAccountInstruction(
        SPL_Token.associatedProgramId,
        SPL_Token.programId,
        SPL_pubkey,
        associatedDestinationTokenAddr,
        toWallet,
        wallet.publicKey,
      ),
    );
  }

  // Add token transfer instructions to transaction
  transaction.add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      associatedDestinationTokenAddr,
      wallet.publicKey,
      [],
      Number(amount) * 10 ** decimals,
    ),
  );

  const { blockhash } = await await connection.getLatestBlockhash("finalized");
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = wallet.publicKey;

  const signed_tx = await wallet.signTransaction(transaction);
  let txid;

  try {
    const _txid = await connection.sendRawTransaction(signed_tx.serialize());
    txid = _txid;
  } catch (err) {
    console.log(err);
    toast.error('Failed to send tranasction to the network')
  }

  if (!txid) return false;

  try {
    const confirmed = await connection.confirmTransaction(
      txid,
      'confirmed'
    );
    if (confirmed.value.err !== null) {
      toast.error('Transaction Failed');
      return false;
    };
    addTip(wallet.publicKey.toBase58(), toWalletAddress, txid);
    return true;
  } catch {
    toast.error('Transaction was not confirmed in 120 seconds');
    return false;
  }

};