import { CLUSTER } from '@/lib/config/constants';
import { clusterApiUrl } from '@/components/Wallet';
import { WalletContextState } from '@solana/wallet-adapter-react';
import WebBundlr from '@bundlr-network/client/build/cjs/web/bundlr';
import { Connection, Transaction } from '@solana/web3.js';

const BUNDLR_URL = CLUSTER === 'devnet' ? 'https://devnet.bundlr.network' : 'https://node1.bundlr.network';

export class BundlrService {
    private bundlr: WebBundlr | null = null;
    
    constructor(private wallet: WalletContextState) {}

    private async initializeBundlr() {
        const rpcEndpoint = clusterApiUrl(CLUSTER);
        const connection = new Connection(rpcEndpoint, {
            commitment: 'processed',
            confirmTransactionInitialTimeout: 120000,
        });
        
        const provider = this.wallet.wallet?.adapter;
        if (!provider) {
            throw new Error('Wallet provider not found');
        }
        await provider.connect();
        const pvd = {
          publicKey: this.wallet.publicKey,
          sendTransaction: async (tx: Transaction) => {
            return await provider.sendTransaction(tx, connection);
          },
          signMessage: async (msg: Uint8Array) => {
            // @ts-ignore
            return this.wallet.signMessage(msg);
          },
        };
        this.bundlr = new WebBundlr(BUNDLR_URL, 'solana', pvd, {
          providerUrl: rpcEndpoint,
          timeout: 60000,
        });
        await this.bundlr.ready();
    };

    public async uploadData(data: any, tags: { name: string, value: string }[]) {
        await this.initializeBundlr();

        if (!this.bundlr) {
            throw new Error('Bundlr not initialized');
        }

        const publicKey = this.wallet.publicKey;

        if (!publicKey) {
            throw new Error('Public key not found');
        }

        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        
        const transaction = this.bundlr.createTransaction(data, { tags });
        try {
            await transaction.sign();
            await transaction.upload();
        } catch (e: any) {
            if (e.message.includes("Not enough funds to send data")) {
                const price = await this.bundlr.getPrice(data.length);
                const minimumFunds = price.multipliedBy(1);
                const balance = await this.bundlr.getBalance(publicKey.toBase58());

                if (balance.isLessThan(minimumFunds)) {
                    await this.bundlr.fund(minimumFunds);
                }

                // Retry signing and uploading after funding
                await transaction.sign();
                await transaction.upload();
            } else {
                throw e;
            }
        }

        const id = transaction.id;

        if (!id) {
            throw new Error('Transaction ID not found');
        }

        const url = `https://arweave.net/${id}`;
        const signature = transaction.signature;
        return { url, signature, error: null };
    }

    public async uploadImage(image: File) {
      console.log('uploadImage', image);
      if (!image.name) return { url: null, error: "File name not present" };

      const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'];
      const extension = image.name.split('.').pop();

      if (!extension) {
        return { url: null, error: "Invalid file extension" }
      }

      if (!allowedExtensions.includes(extension)) {
        return { url: null, error: "File type not allowed" }
      }

      const type = extension === 'jpg' ? 'jpeg' : extension;
      const tags = [{ name: "Content-Type", value: `image/${type}` }];

      await this.initializeBundlr();

      if (!this.bundlr) {
        throw new Error('Bundlr not initialized');
      }

      const publicKey = this.wallet?.publicKey;

      if (!publicKey) {
        throw new Error('Public key not found');
      }

      if (image.size > 8e+6) {
        throw new Error('Please upload an image less than 8mb in size');
      }
      await this.bundlr.fund(1000);
      const file = Buffer.from(await image.arrayBuffer());
      console.log('file', file);
      const transaction = this.bundlr.createTransaction(file, { tags });
      try {
        await transaction.sign();
        await transaction.upload();
      } catch (e: any) {
        console.log('error message', e.message);
        if (e.message.includes("Not enough funds to send data") || e.message.includes("Not enough balance for transaction")) {
          const price = await this.bundlr.getPrice(image.size);
          const minimumFunds = price.multipliedBy(5);
          const balance = await this.bundlr.getBalance(publicKey.toBase58());
          console.log(`Balance is ${balance} and minimum funds is ${minimumFunds} and ${balance.isLessThan(minimumFunds)}`);
          if (balance.isLessThan(minimumFunds)) {
            console.log('Funding bundlr account');
            await this.bundlr.fund(minimumFunds);
          }

          // Retry signing and uploading after funding
          await transaction.sign();
          await transaction.upload();
        } else {
          throw e;
        }
      }
      
      const id = transaction.id;

      if (!id) {
        throw new Error('Transaction ID not found');
      }

      const url = `https://arweave.net/${id}`;
      const signature = transaction.signature;
      return { url, signature, error: null };
    }

}

