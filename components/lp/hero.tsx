import { Navbar } from '@/components/Navbar';

import styles from '@/styles/Home.module.scss';
import vector from '@/images/lp/hero.svg';

// partners
import bundlr from '@/images/lp/partners/bundlr.svg';
import bonfida from '@/images/lp/partners/bonfida.svg';
import snowflake from '@/images/lp/partners/snowflake.svg';
import dialect from '@/images/lp/partners/dialect.svg';
import marginfi from '@/images/lp/partners/marginfi.svg';
import arweave from '@/images/lp/partners/arweave.svg';
import squads from '@/images/lp/partners/squads.svg';

const allPartners = [arweave, bundlr, bonfida, snowflake, dialect, marginfi, squads];

function HeroSection() {
  return (
    <div className={styles.heroSection}>
      <div className={styles.heroGradient} />
      <Navbar />

      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <h1 className="text center nm font-2 weight-800 size-56 gray-800 mb-0-5">The foundation for <br /><span>|</span> decentralized social apps</h1>
          <p className="text center nm font-2 weight-400 size-24 gray-500 mt-3">Wordcel is building a protocol for the next generation of social network applications</p>
        </div>
        <img className={styles.heroVector} src={vector.src} alt="" />

        <p className="text center nm font-2 weight-600 size-16 gray-400 mt-5 z-3">TRUSTED AND USED BY</p>
        <div className={styles.trustedSection}>
          {allPartners.map((partner, index) => (
            <img key={index} className={styles.trustedPartner} src={partner.src} alt="" />
          ))}
        </div>

      </div>


    </div>
  );
}

export { HeroSection };