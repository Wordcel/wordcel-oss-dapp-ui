import cashIcon from '@/images/icons/cash.svg';
import styles from '@/styles/Static.module.scss';

import { TipModal } from './Modals';
import { User } from '@/types/props';
import { useWallet } from '@solana/wallet-adapter-react';
import { sendSPL } from '@/lib/sendSPL';
import { useState } from 'react';

function TipButton({
  user
}: {
  user: User
}) {
  const wallet = useWallet();
  const [status, setStatus] = useState('dormant');

  const handleTip = async () => {
    await sendSPL(
      wallet,
      user.public_key,
      1,
      setStatus
    );
    setTimeout(() => {
      setStatus('dormant');
    }, 4000)
  }

  return (
    <button className={styles.tipButton}>
      <div className={styles.tipButtonContent} onClick={handleTip}>
        <img src={cashIcon.src} alt="" />
        <span>Tip</span>
      </div>
      <TipModal status={status} setStatus={setStatus} />
    </button>
  );

}

export { TipButton }