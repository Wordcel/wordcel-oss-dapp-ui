import { useWindowSize } from '@/components/Hooks';

import vector from '@/images/lp/protocol.svg';
import verticalVector from '@/images/lp/protocol-vertical.svg';
import styles from '@/styles/Home.module.scss';

function ProtocolSection() {
  const { width } = useWindowSize();
  return (
    <div className={styles.protocolContainer}>
      <div className={styles.protocolContent}>
        <p className={styles.protocolText}>PROTOCOL</p>
        <div className={styles.protocolMaxWidth}>
          <h1 className="text center font-2 white weight-700 size-58 nm mt-1">Decentralised & an open-social graph</h1>
          <p className="text center font-2 weight-400 gray-400 size-22 nm mt-3">A fully composable and programmble social graph where users own their content and can take it anywhere</p>
        </div>
        <img className={styles.protocolVector} src={(width && width > 768) ? vector.src : verticalVector.src} alt="" />
      </div>
    </div>
  );
}

export { ProtocolSection };