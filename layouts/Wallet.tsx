import toast from 'react-hot-toast';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
  GlowWalletAdapter
} from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  useWalletModal
} from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/router';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export const clusterApiUrl = (cluster: 'devnet' | 'mainnet-beta') => (
  cluster === 'devnet'
    ? 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/'
    : 'https://ssc-dao.genesysgo.net/'
);

export const Wallet: FC = ({
  children
}) => {
  const network =
    (typeof window !== 'undefined'
    && window.location.host.includes('localhost'))
    ? WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
      new GlowWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ConnectWallet = ({
  children,
  noFullSize,
  redirectToWelcome,
  noToast
}: {
  children: React.ReactNode;
  noFullSize?: boolean;
  redirectToWelcome?: boolean;
  noToast?: boolean;
}) => {
  const { wallet, connect, publicKey } = useWallet();
  const { visible, setVisible } = useWalletModal();
  const router = useRouter();

  useEffect(() => {
    if (!publicKey && wallet) {
      try {
        connect();
      } catch (e) {
        console.error(e);
      }
      return;
    }
    if (publicKey && !visible) {
      console.log(`User Public Key: ${publicKey}`);
      if (!noToast) toast.success('Connected to wallet');
      if (redirectToWelcome) router.push(`/welcome/${publicKey}`);
    }
  }, [wallet, visible, publicKey, redirectToWelcome]);


  const handleConnect = () => {
    if (!wallet) {
      setVisible(true);
    } else {
      try {
        connect();
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <div
      style={{
        width: noFullSize ? 'max-content' : '100%',
        height: noFullSize ? 'max-content' : '100%'
      }}
      onClick={handleConnect}
    >
      {children}
    </div>
  );
}