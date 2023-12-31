import toast from 'react-hot-toast';
import { Transaction, Connection } from '@solana/web3.js';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export async function sendAndConfirmTransaction (
  connection: Connection,
  transaction: Transaction,
  wallet: AnchorWallet,
  confirmTransaction = true
) {
  let _txid = '';
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
    _txid = txid;
    if (!confirmTransaction && txid) {
      toast.success('Transaction sent');
      return txid;
    };
    if (!txid || !confirmTransaction) return;
  } catch (e) {
    toast.dismiss();
    toast.error('Failed to send transaction to the network');
    console.error(e);
    return false;
  }

  try {
    // Confirm Transaction
    const confirmation = connection.confirmTransaction(_txid, 'processed');
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
