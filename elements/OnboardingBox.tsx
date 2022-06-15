import toast from 'react-hot-toast';
import styles from '@/styles/Static.module.scss';
import tweetToVerify from '@/images/elements/tweet-to-verify.svg';
import uploadImagePreview from '@/images/elements/upload.svg';
import greenCheck from '@/images/elements/green-check.svg';
import twitterIcon from '@/images/icons/twitter.svg';

import { Done, Step } from '@/images/dynamic/Step';
import { useEffect, useRef, useState } from 'react';
import { getUserSignature } from '@/lib/signMessage';
import { getAllUserDomains } from '@/lib/getAllUserDomains';
import { createNewProfile, verifyTwitterRequest } from '@/components/networkRequests';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { createFreshProfile } from '@/components/contractInteraction';
import { getUserNFTs } from '@/lib/getAllUserNFTs';
import { uploadFile } from '@/components/upload';
import Link from 'next/link';


export const OnboardingBox = ({
  setDone
}: { setDone: (done: boolean) => void }) => {

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [twitter, setTwitter] = useState('');
  const [blog_name, setBlogName] = useState('');
  const [username, setUsername] = useState('');

  const [step, setStep] = useState(1);
  const [refresher, setRefresher] = useState(0);
  const [nfts, setNFTs] = useState<Set<string>>(new Set());
  const [domains, setDomains] = useState<string[]>([]);

  const wallet = useAnchorWallet();
  const fileInputRef = useRef(null);
  const { publicKey, signMessage } = useWallet();

  useEffect(() => {
    (async function () {
      if (!publicKey) return;
      const sns_domains = await getAllUserDomains(publicKey);
      setDomains(sns_domains);
    })();
  }, [publicKey]);

  useEffect(() => {
    if (!publicKey) return;
    getUserNFTs(
      publicKey.toBase58(),
      (nft: string) => nfts.add(nft)
    );
    const interval = setInterval(() => setRefresher(refresher + 1), 1000);
    return () => clearInterval(interval);
  }, [publicKey]);

  const tabIsActive = (tab: number) => step === tab;
  const getTabClassName = (tab: number) => {
    if (tabIsActive(tab)) return styles.activeTab;
    return styles.tab;
  }

  const handleTweetButton = () => {
    if (!publicKey) return;
    setTwitter(twitter.replace('@', ''));
    if (twitter.replace('@', '').length === 0) {
      toast('Please enter a twitter username');
      return;
    };
    const encoded_tweet = `I'm%20verifying%20my%20wallet%20address%20for%20@Wordcel_Club%0A%0A${publicKey.toBase58()}%0A%0Ahttps://wordcel.club`;
    window.open(`https://twitter.com/intent/tweet?text=${encoded_tweet}`, '_blank');
  }

  const shareTweetEncodedURL = `https://twitter.com/intent/tweet?text=Hey!%20I%20just%20set%20up%20my%20@wordcel_club%20profile,%20check%20it%20out%20here:%0Ahttps://wordcel.club/${username}`;

  const handleTweetedButton = async () => {
    setTwitter(twitter.replace('@', ''));
    if (twitter.replace('@', '').length === 0) {
      toast('Please enter a twitter username');
      return;
    };
    if (!publicKey || !signMessage) return;
    const signature = await getUserSignature(signMessage, publicKey.toBase58());
    if (!signature) {
      toast('Please sign the message to authenticate your wallet');
      return;
    }
    const request = verifyTwitterRequest(
      publicKey.toBase58(),
      twitter.replace('@', ''),
      signature
    );
    toast.promise(request, {
      success: 'Successfully verified your twitter account',
      error: 'Failed to verify your twitter account, please try again',
      loading: 'Verifying your twitter account',
    });
    const verified = await request;
    if (verified) {
      setStep(2);
    }
  };

  const handleDomainChange = (domain: string) => {
    if (username === domain) {
      setUsername('');
      return;
    }
    setUsername(domain);
  };

  const handleUploadButton = () => {
    // @ts-expect-error
    fileInputRef?.current?.click();
  }

  const handleSubmit = async () => {
    if (!publicKey || !signMessage) return;
    const signature = await getUserSignature(signMessage, publicKey.toBase58());
    if (!signature) {
      toast('Please sign the message to authenticate your wallet');
      return;
    }
    if (!name || !blog_name || !image || !username) {
      toast('Please enter your name, username, blog name and select an image');
      return;
    }
    const profile_hash = await createFreshProfile(wallet as any);
    if (!profile_hash) return;
    const request = createNewProfile({
      name: name,
      public_key: publicKey.toBase58(),
      username: username,
      twitter: twitter,
      blog_name: blog_name,
      image_url: image,
      profile_hash: profile_hash,
      signature: signature,
    });
    toast.promise(request, {
      success: 'Successfully created profile',
      error: 'Failed to create profile',
      loading: 'Creating your new profile',
    });
    const verified = await request;
    if (verified) {
      setDone(true);
      setStep(3);
      console.log('New profile created successfully');
    }
  };

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

  return (
    <div className={styles.obBox}>
      {(step === 1 || step === 2) && (
        <Header />
      )}
      {step === 1 && (
        <div className={styles.obContent}>
          <p className="normal-text sm">What's your Twitter username?</p>
          <input
            onChange={(e) => setTwitter(e.target.value)}
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
            <button
              onClick={handleTweetedButton}
              className={styles.tweetedButton}
            >
              I've Tweeted
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className={styles.obContent}>
          <p className="normal-text sm">What's your display name?</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="onboarding-input"
            placeholder="Elon Musk"
          />
          <p className="normal-text sm">What's your blog name?</p>
          <input
            onChange={(e) => setBlogName(e.target.value)}
            className="onboarding-input"
            placeholder="SpaceX Blog"
          />

          <div className="mt-2 mb-2">
            <p className="normal-text sm nm">Upload Profile Photo</p>
            <div className={styles.uploadImageDiv}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadFile(file);
                  setImage(url);
                }}
              />
              <img
                className={styles.uploadPreview}
                src={image ? image : uploadImagePreview.src}
                alt=""
              />
              <button
                onClick={handleUploadButton}
                className={styles.uploadButton}
              >Upload</button>
            </div>
          </div>

          <div className="mt-2 mb-2">
            <p className="normal-text sm nm">{"Choose a domain as your username"}</p>
            {domains.length > 0 && (
              <div className={styles.domainGrid}>
                {domains.map((domain) => (
                  <div
                    key={domain}
                    onClick={() => handleDomainChange(domain)}
                    className={styles.domain}
                    style={{ border: username === domain ? '0.12rem solid black' : '0.12rem solid #D8D8D8' }}
                  >
                    <p className="nm">{
                      domain.length > 20 ? `...${domain.slice(domain.length-18, domain.length)}` : domain
                    }</p>
                  </div>
                ))}
              </div>
            )}
            {domains.length === 0 && (
              <p className="normal-text sm">It seems like you don't have any domains, you need a .SOL domain to sign up</p>
            )}
          </div>

          {Array.from(nfts).length > 0 && (
            <div>
              <p className="normal-text sm">{"Select NFT as Profile Photo"}</p>
              <div className={styles.nftGrid}>
                {Array.from(nfts).map((nft, index) => (
                  <img
                    className={styles.nftImage} key={index}
                    src={nft} alt=""
                    onClick={() => setImage(nft)}
                    style={{ opacity: nft === image ? '1' : '' }}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="secondary-btn mt-2"
          >Continue</button>

        </div>
      )}

      {step === 3 && (
        <div className={styles.stepThree}>
          <img src={greenCheck.src} />
          <h1 className="subheading lg bold center nm mt-2">You're all set, {name.split(' ')[0]}.</h1>
          <p className="light-sub-heading thin center">Welcome to Wordcel. The future of decentralised publishing is now.</p>
          <div className={styles.stepThreeButtons}>
            <a href={shareTweetEncodedURL} target="_blank" rel="noopener noreferrer">
              <button className={styles.shareProfileBtn}>
                <img src={twitterIcon.src} alt="" />
                Share your Profile
              </button>
            </a>
            <Link href={'/dashboard/' + publicKey?.toBase58() + '/drafts'}>
              <a>
                <button className="gray-btn sm mt-1">Continue to Dashboard</button>
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
