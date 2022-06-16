import toast from 'react-hot-toast';
import * as anchor from '@project-serum/anchor';
import { Transaction, Connection } from '@solana/web3.js';

export async function sendAndConfirmTransaction (
  connection: Connection,
  transaction: Transaction,
  wallet: anchor.Wallet,
  confirmTransaction = true
) {
  try {

    // Configure the Transaction
    toast.loading('Sending Transaction');
    const tx = transaction;
    tx.feePayer = wallet.publicKey;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const signedTx = await wallet.signTransaction(tx);
    if (!signedTx) return;

    // Send Transaction and wait for Transaction ID
    const txid = await connection.sendRawTransaction(signedTx.serialize());
    console.log('Transaction ID:', txid);
    toast.dismiss();
    if (!confirmTransaction && txid) {
      toast.success('Transaction sent');
      return txid;
    };
    if (!txid || !confirmTransaction) return;

    // Confirm Transaction
    const confirmation = connection.confirmTransaction(txid);
    toast.promise(confirmation, {
      loading: 'Confirming Transaction',
      success: 'Transaction Confirmed',
      error: 'Transaction Failed'
    });
    const confirmed = await confirmation;
    if (confirmed.value.err !== null) {
      toast.error('Transaction Failed');
      return false;
    };
    return true;
  } catch {
    toast.error('Transaction was not confirmed in 120 seconds');
    return false;
  }
};
