import styles from '@/styles/Static.module.scss';
import quill from '@/images/elements/quill.svg';
import { ConnectWallet } from '@/layouts/Wallet';

export const RequestConnect = () => {
  return (
    <>
      <div className={styles.header}>
        <img src={quill.src} alt="" />
        <h1 className="text size-36 weight-700 gray-700 center nm mt-2">Please connect your wallet to continue</h1>
      </div>
      <div className={styles.form}>
        <ConnectWallet>
          <button className="secondary-btn mt-2">Connect Wallet</button>
        </ConnectWallet>
      </div>
    </>
  );
}