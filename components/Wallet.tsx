import toast from 'react-hot-toast';
import React, { FC, useEffect, useMemo, useState, useRef } from 'react';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  GlowWalletAdapter,
  BackpackWalletAdapter
} from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  useWalletModal
} from '@solana/wallet-adapter-react-ui';
import { CLUSTER, DEVNET_ENDPOINT, MAINNET_ENDPOINT } from '@/lib/config/constants';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

export const clusterApiUrl = (cluster: 'devnet' | 'mainnet-beta') => (
  cluster === 'devnet'
    ? DEVNET_ENDPOINT
    : MAINNET_ENDPOINT
);

export const AutoClear = () => {
  const { wallet, publicKey } = useWallet();

  const walletRef = useRef(wallet);
  const publicKeyRef = useRef(publicKey);

  publicKeyRef.current = publicKey;
  walletRef.current = wallet;

  useEffect(() => {
    const interval = setInterval(() => {
      if (walletRef.current && publicKeyRef.current) {
        let currentKey = '';
        if ((walletRef.current.adapter as any)?._wallet?.publicKey) {
          currentKey = (walletRef.current.adapter as any)._wallet.publicKey.toBase58();
        }
        if (currentKey && currentKey !== publicKeyRef?.current.toBase58()) {
          localStorage.clear();
          window.location.reload();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <></>;
}

export const Wallet = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const network = CLUSTER === 'devnet' ? WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
      new GlowWalletAdapter(),
      new BackpackWalletAdapter()
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <WalletModalProvider>
          <AutoClear />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ConnectWallet = ({
  children,
  noFullSize,
  noToast,
  afterConnect
}: {
  children: React.ReactNode;
  noFullSize?: boolean;
  noToast?: boolean;
  afterConnect?: any;
}) => {
  const { wallet, connect, publicKey } = useWallet();
  const { visible, setVisible } = useWalletModal();
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const req = !publicKey && wallet && wallet.readyState === 'Installed' && clicked;
    if (req) {
      try {
        connect();
      } catch (e) {
        console.error(e);
      }
      return;
    }
    if (publicKey && !noToast) toast.success('Connected to wallet');
    if (afterConnect) afterConnect();
  }, [
    wallet,
    visible,
    publicKey,
    clicked
  ]);

  const handleConnect = () => {
    if (wallet) return;
    setVisible(true);
  }

  return (
    <div
      style={{
        width: noFullSize ? 'max-content' : '100%',
        height: noFullSize ? 'max-content' : '100%'
      }}
      onClick={() => {
        setClicked(true);
        handleConnect();
      }}
    >
      {children}
    </div>
  );
};
