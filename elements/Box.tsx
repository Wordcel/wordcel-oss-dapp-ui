import styles from '@/styles/Elements.module.scss';

export const DefaultBox = (
  {children}: { children: any }
) => {
  return (
    <div className={styles.squareBox}>
      {children}
    </div>
  );
};
