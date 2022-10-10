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
    setStatus('started');
    const confirmed = await sendSPL(
      wallet,
      user.public_key,
      1,
    );
  }

  return (
    <button onClick={handleTip} className={styles.tipButton}>
      <img src={cashIcon.src} alt="" />
      <span>Tip</span>
      <TipModal status={status} setStatus={setStatus} />
    </button>
  );

}

export { TipButton }