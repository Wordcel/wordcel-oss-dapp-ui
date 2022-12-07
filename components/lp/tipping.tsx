import styles from '@/styles/Home.module.scss';
import vector from '@/images/lp/tipping.svg';

function TippingSection() {
  return (
    <div className={[styles.spaceBetweenContainer, styles.marginTop].join(" ")}>
      <img className={styles.tippingVector} src={vector.src} alt="" />
      <div className={styles.tippingSectionMaxWidth}>
        <p className="text nm font-2 weight-600 gray-400 size-20">TIPPING</p>
        <p className="text nm font-2 weight-700 gray-900 size-48 mt-1-5">Tipping powered by crypto</p>
        <p className="text nm font-2 weight-400 gray-400 size-24 mt-1-5">Send and recieve tips on-chain in USDC using our built-in tipping feature</p>
      </div>
    </div>
  );
}

export { TippingSection };