import {
  Backend,
  Config,
  defaultVariables,
  DialectContextProvider,
  DialectThemeProvider,
  DialectUiManagementProvider,
  DialectWalletAdapter,
  IncomingThemeVariables,
  NotificationsButton,
} from '@wordcel/dialect-react';
import * as anchor from '@project-serum/anchor';
import {
  useConnection,
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import { useEffect, useMemo, useState } from 'react';
import styles from '@/styles/Notification.module.scss';
import notificationIcon from '@/images/elements/no-notification.svg';
import settingsIcon from '@/images/elements/settings.svg';
import trashIcon from '@/images/elements/trash.svg';

const DIALECT_PUBLIC_KEY = new anchor.web3.PublicKey(
  'EMJhYtWKbPtkbSzWk32fAYmMvEgCQubXQaCV2n7BCkog'
);

export const themeVariables: IncomingThemeVariables = {
  light: {
    colors: {
      bg: styles.white,
      toggleBackgroundActive: styles.toggleBackgroundActive,
      toggleThumb: styles.white,
      highlight: styles.white,
    },
    textStyles: {
      header: `${defaultVariables.light.textStyles.header} ${styles.text} font-normal`,
      body: `${defaultVariables.light.textStyles.body} ${styles.text}`,
      h1: `${defaultVariables.light.textStyles.h1} ${styles.text}`,
      input: `${defaultVariables.light.textStyles.input} ${styles.input_box}`,
      small: `${defaultVariables.light.textStyles.small} ${styles.text}`,
      bigText: `${defaultVariables.light.textStyles.bigText} ${styles.text}`,
      buttonText: `${defaultVariables.light.textStyles.buttonText} ${styles.text}`,
      link: `${defaultVariables.light.textStyles.link} ${styles.text}`,
      label: `${defaultVariables.light.textStyles.label} ${styles.text} font-normal`,
    },
    icons: {
      noNotifications: notificationIcon,
      settings: settingsIcon,
      trash: trashIcon,
    },
    highlighted: styles.highlighted,
    outlinedInput: styles.outlinedInput,
    input: styles.input,
    modal: `${defaultVariables.light.modal} ${styles.modal}`,
    // modalWrapper: styles.modalWrapper,
    sliderWrapper: `${defaultVariables.light.sliderWrapper} ${styles.sliderWrapper}`,
    iconButton: `${defaultVariables.light.iconButton} ${styles.iconButton}`,
    addormentButton: styles.addormentButton,
  },
  // animations: {
  //   popup: {
  //     enter: 'transition-all duration-300 origin-top-right',
  //     enterFrom: 'opacity-0 scale-75',
  //     enterTo: 'opacity-100 scale-100',
  //     leave: 'transition-all duration-100 origin-top-right',
  //     leaveFrom: 'opacity-100 scale-100',
  //     leaveTo: 'opacity-0 scale-75',
  //   },
  // },
};

// TODO: move this to any other place and export it
const walletToDialectWallet = (
  wallet: WalletContextState
): DialectWalletAdapter => ({
  publicKey: wallet.publicKey!,
  connected:
    wallet.connected &&
    !wallet.connecting &&
    !wallet.disconnecting &&
    Boolean(wallet.publicKey),
  signMessage: wallet.signMessage,
  signTransaction: wallet.signTransaction,
  signAllTransactions: wallet.signAllTransactions,
  //@ts-ignore
  diffieHellman: wallet.wallet?.adapter?._wallet?.diffieHellman
    ? async (pubKey) => {
        //@ts-ignore
        return wallet.wallet?.adapter?._wallet?.diffieHellman(pubKey);
      }
    : undefined,
});

type ThemeType = 'light' | 'dark' | undefined;

function AuthedHome() {
  return (
    <NotificationsButton
      dialectId="dialect-notifications"
      notifications={[
        {
          name: 'Example notification',
          detail:
            'This is an example notification that is never sent. More examples coming soon',
        },
      ]}
      pollingInterval={15000}
      channels={['web3', 'email']}
    />
  );
}

export function WordcelNotification(): JSX.Element {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [theme, setTheme] = useState<ThemeType>('light');

  const [dialectWalletAdapter, setDialectWalletAdapter] =
    useState<DialectWalletAdapter>(() => walletToDialectWallet(wallet));

  useEffect(() => {
    setDialectWalletAdapter(walletToDialectWallet(wallet));
  }, [wallet]);

  const dialectConfig = useMemo(
    (): Config => ({
      backends: [Backend.DialectCloud, Backend.Solana],
      environment: 'development',
      dialectCloud: {
        tokenStore: 'local-storage',
      },
      solana: {
        rpcUrl: 'https://api.devnet.solana.com'
      },
    }),
    [connection]
  );

  return (
    <DialectContextProvider
      wallet={dialectWalletAdapter}
      config={dialectConfig}
      dapp={DIALECT_PUBLIC_KEY}
      gate={() =>
        new Promise((resolve) => setTimeout(() => resolve(true), 3000))
      }
    >
      <DialectThemeProvider theme={theme} variables={themeVariables}>
        <DialectUiManagementProvider>
          <AuthedHome />
        </DialectUiManagementProvider>
      </DialectThemeProvider>
    </DialectContextProvider>
  );
}
