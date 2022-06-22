import Link from 'next/link';
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
import { uploadImageBundlr } from '@/components/uploadBundlr';
import { messageToSign } from '@/lib/verifyTwitter';


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
  const [nfts] = useState<Set<string>>(new Set());
  const [domains, setDomains] = useState<string[]>([]);

  const wallet = useAnchorWallet();
  const walletContext = useWallet();
  const fileInputRef = useRef(null);
  const { publicKey, signMessage } = useWallet();

  useEffect(() => {
    (async function () {
      if (!publicKey) return;
      const sns_domains = await getAllUserDomains(publicKey);
      console.log('Domains:', sns_domains);
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

  useEffect(() => {
    if (domains.length === 1) setUsername(domains[0]);
  }, [domains])

  const tabIsActive = (tab: number) => step === tab;
  const getTabClassName = (tab: number) => {
    if (tabIsActive(tab)) return styles.activeTab;
    return styles.tab;
  }

  const handleTweetButton = async () => {
    if (!publicKey || !signMessage) return;
    const sanitizedTwitterHandle = twitter.replaceAll('@', '');
    setTwitter(sanitizedTwitterHandle);
    if (sanitizedTwitterHandle.length === 0) {
      toast('Please enter a Twitter username');
      return;
    };
    const signature = await signMessage(
      new TextEncoder().encode(messageToSign(sanitizedTwitterHandle))
    );
    if (!signature) return;
    const tweet = `I'm verifying my Twitter account for @Wordcel_Club\n\nhttps://wordcel.club/\n\n${Buffer.from(signature).toString('base64')}`
    const encodedTweet = encodeURIComponent(tweet);
    window.open(`https://twitter.com/intent/tweet?text=${encodedTweet}`, '_blank');
  }

  const shareTweetEncodedURL = `https://twitter.com/intent/tweet?text=Hey!%20I%20just%20set%20up%20my%20@wordcel_club%20profile,%20check%20it%20out%20here:%0Ahttps://wordcel.club/${username}`;

  const handleTweetedButton = async () => {
    const sanitizedTwitterHandle = twitter.replaceAll('@', '');
    setTwitter(sanitizedTwitterHandle);
    if (sanitizedTwitterHandle.length === 0) {
      toast('Please enter a Twitter username');
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
      sanitizedTwitterHandle,
      signature
    );
    toast.promise(request, {
      success: 'Successfully verified your Twitter account',
      error: 'Failed to verify your Twitter account, please try again',
      loading: 'Verifying your Twitter account',
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
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImageBundlr(file, walletContext);
                  if (url) setImage(url);
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
                    <div
                      style={{ backgroundColor: username === domain ? 'black' : 'transparent' }}
                      className={styles.radioBox}
                    />
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
                    onError={() => nfts.delete(nft)}
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
