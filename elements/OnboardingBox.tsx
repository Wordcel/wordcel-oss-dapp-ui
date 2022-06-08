import toast from 'react-hot-toast';
import styles from '@/styles/Static.module.scss';
import tweetToVerify from '@/images/elements/tweet-to-verify.svg';
import { useState } from 'react';
import { Done, Step } from '@/images/dynamic/Step';
import { useWallet } from '@solana/wallet-adapter-react';

export const OnboardingBox = () => {
  let [name] = useState('');
  let [twitter] = useState('');
  let [username] = useState('');
  let [blog_name] = useState('');

  const { publicKey } = useWallet();

  const [step, setStep] = useState(1);
  const [twitterVerified, setTwitterVerified] = useState(false);

  const tabIsActive = (tab: number) => step === tab;
  const getTabClassName = (tab: number) => {
    if (tabIsActive(tab)) return styles.activeTab;
    return styles.tab;
  }

  const handleNameServiceDomain = (
    domain: string
  ) => {
    username = domain;
    setStep(2);
  };

  const handleTweetButton = () => {
    if (!publicKey) return;
    if (twitter.replace('@', '').length === 0) {
      toast('Please enter a twitter username');
      return;
    };
    const encoded_tweet = `I'm%20verifying%20my%20wallet%20address%20for%20@Wordcel_Club%0A%0A${publicKey.toBase58()}%0A%0Ahttps://wordcel.club`;
    window.open(`https://twitter.com/intent/tweet?text=${encoded_tweet}`, '_blank');
  }

  // Replace this with user's domains
  const name_service_domains = ['kunal.sol', 'shek.sol', 'paarug.sol']

  const Header = () => {
    return (
      <div className={styles.obHeader}>
        <div className={getTabClassName(1)}>
          {step === 1 && (
            <Step step={1} />
          )}
          {step === 2 && (
            <Done />
          )}
          <p className={`normal-text ml-3 sm ${tabIsActive(1) ? 'op-1' : ''}`}>Verify</p>
        </div>
        <div className={getTabClassName(2)}>
          <Step step={2} />
          <p className={`normal-text ml-3 sm ${tabIsActive(2) ? 'op-1' : ''}`}>Profile</p>
        </div>
      </div>
    );
  };

  const StepOne = () => {
    return (
      <div className={styles.obContent}>
        <p className="normal-text sm">What's your Twitter username?</p>
        <input
          onChange={(e) => twitter = e.target.value}
          className="onboarding-input"
          placeholder="@wordcel_club"
        />
        <div className={styles.tweetButtons}>
          <button
            onClick={handleTweetButton}
            className={styles.tweetButton}
          >
            <img src={tweetToVerify.src} alt="Tweet to Verify" />
          </button>
          <button className={styles.tweetedButton}>
            I've Tweeted
          </button>
        </div>
        {name_service_domains.length > 0 && (
          <div>
            <p className="normal-text mt-2 sm dark op-1">OR</p>
            <p className="normal-text mt-1 sm">Select a name service domain</p>
            <div className={styles.domainGrid}>
              {name_service_domains.map((domain) => (
                <div
                  key={domain}
                  onClick={() => handleNameServiceDomain(domain)}
                  className={styles.domain}
                >
                  <p className="nm">{
                    domain.length > 10 ? `...${domain.slice(domain.length-8, domain.length)}` : domain
                  }</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  };

  const StepTwo = () => {
    return (
      <div className={styles.obContent}>
        <p className="normal-text sm">What's your display name?</p>
        <input
          onChange={(e) => name = e.target.value}
          className="onboarding-input"
          placeholder="Elon Musk"
        />
        <p className="normal-text sm">What's your blog name?</p>
        <input
          onChange={(e) => blog_name = e.target.value}
          className="onboarding-input"
          placeholder="SpaceX Blog"
        />
      </div>
    )
  };

  return (
    <div className={styles.obBox}>
      <Header />
      {step === 1 && (
        <StepOne />
      )}
      {step === 2 && (
        <StepTwo />
      )}
    </div>
  );
};
