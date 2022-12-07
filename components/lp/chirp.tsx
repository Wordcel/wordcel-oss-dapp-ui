import styles from '@/styles/Home.module.scss';
import vector from '@/images/lp/chirp.svg';
import logo from '@/images/lp/chirp-logo.svg';

function ChirpSection() {
  return (
    <div className={[styles.spaceBetweenContainer, styles.spaceBetweenContainerCenter, styles.marginTopLarge].join(" ")}>
      <div className={styles.editorSectionMaxWidth}>
        <img className={styles.chirpLogo} src={logo.src} alt="" />
        <p className="text nm font-2 weight-700 gray-900 size-48 mt-2">Introducing Chirp</p>
        <p className="text nm font-2 weight-400 gray-400 size-24 mt-1-5">A decentralized social network, coming soon to your Backpack, iOS and Saga/Android.</p>
        <a href="#">
          <p className={styles.earlyAccess}>Apply for Early Access <span>{"->"}</span></p>
        </a>
      </div>
      <img className={styles.chirpVector} src={vector.src} alt="" />
    </div>
  );
}

export { ChirpSection };