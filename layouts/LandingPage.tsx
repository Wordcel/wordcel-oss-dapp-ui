import styles from '@/styles/Home.module.scss';
import { DefaultHead } from './DefaultHead';

export const LandingPage = () => {
  return (
    <div>
      <DefaultHead />
      <div className={styles.heroGradient} />
    </div>
  )
};