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
      highlightSolid: styles.highlightSolid,
      notificationBadgeColor: styles.notificationBadgeColor,
    },
    textStyles: {
      header: `${defaultVariables.light.textStyles.header} ${styles.headerText}`,
      body: `${defaultVariables.light.textStyles.body} ${styles.bodyText}`,
      h1: `${defaultVariables.light.textStyles.h1} ${styles.text}`,
      input: `${defaultVariables.light.textStyles.input} ${styles.input_box}`,
      small: `${defaultVariables.light.textStyles.small} ${styles.smallText}`,
      bigText: `${defaultVariables.light.textStyles.bigText} ${styles.text}`,
      buttonText: `${defaultVariables.light.textStyles.buttonText} ${styles.buttonText}`,
      link: `${defaultVariables.light.textStyles.link} ${styles.text}`,
      label: `${defaultVariables.light.textStyles.label} ${styles.text} ${styles.label}`,
    },
    input: styles.input,
    header: styles.header,
    button: styles.button,
    bellButton: styles.bellButton,
    notificationHeader: styles.notificationHeader,
    notificationMessage: `${styles.notificationMessage} `,
    notificationsDivider: styles.notificationsDivider,
    outlinedInput: styles.outlinedInput,
    highlighted: styles.highlighted,
    modal: `${defaultVariables.light.modal} ${styles.modal}`,
    modalWrapper: styles.modelWrapperTwo,
    sliderWrapper: `${defaultVariables.light.sliderWrapper} ${styles.sliderWrapper}`,
    iconButton: `${defaultVariables.light.iconButton} ${styles.iconButton}`,
    addormentButton: styles.addormentButton,
    section: styles.section,
  },
  animations: {
    popup: {
      enter: 'transition-all duration-300 origin-top-right',
      enterFrom: 'opacity-0 scale-75',
      enterTo: 'opacity-100 scale-100',
      leave: 'transition-all duration-100 origin-top-right',
      leaveFrom: 'opacity-100 scale-100',
      leaveTo: 'opacity-0 scale-75',
    },
  },
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
      channels={['web3', 'email', 'telegram']}
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
      backends: [Backend.Solana, Backend.DialectCloud],
      environment: 'development',
      dialectCloud: {
        tokenStore: 'local-storage',
      },
      solana: {
        rpcUrl: 'https://api.devnet.solana.com' // replace it with connection rpc url
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
