import styles from '@/styles/Home.module.scss';

// Section Imports
import { Footer } from '@/components/Footer';
import { ChirpSection } from '@/components/lp/chirp';
import { EditorSection } from '@/components/lp/editor';
import { ProtocolSection } from '@/components/lp/protocol';
import { TippingSection } from '@/components/lp/tipping';
import { DefaultHead } from '@/components/DefaultHead';
import { WhySection } from '@/components/lp/why';
import { PressSection } from '@/components/lp/press';
import { HeroSection } from '@/components/lp/hero';


function LandingPage() {
  return (
    <div className={styles.centerContainer}>
      <DefaultHead />
      <HeroSection />
      <PressSection />
      <WhySection />
      <EditorSection />
      <TippingSection />
      // <ChirpSection />
      <ProtocolSection />
      <Footer />
    </div>
  );
}

export { LandingPage };
