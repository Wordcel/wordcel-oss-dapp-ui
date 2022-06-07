import styles from '@/styles/Static.module.scss';
import { useState } from 'react';

export const OnboardingBox = () => {
  const [step, setStep] = useState(1);

  return (
    <div className={styles.obBox}>
      <div className={styles.obHeader}>

      </div>
    </div>
  );
}