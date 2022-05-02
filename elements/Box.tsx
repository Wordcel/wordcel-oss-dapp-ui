import styles from '@/styles/Elements.module.scss';
import { NextComponentType } from 'next';

export const DefaultBox: NextComponentType = (
  {children}
) => {
  return (
    <div className={styles.squareBox}>
      {children}
    </div>
  );
};
