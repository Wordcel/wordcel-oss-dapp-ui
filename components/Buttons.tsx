import cashIcon from '@/images/icons/cash.svg';
import styles from '@/styles/Static.module.scss';

import { User } from '@/types/props';
import { useWallet } from '@solana/wallet-adapter-react';
import { sendSPL } from '@/lib/sendSPL';

function TipButton({
  user
}: {
  user: User
}) {
  const wallet = useWallet();

  const handleTip = async () => {
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
    </button>
  );

}

export { TipButton }