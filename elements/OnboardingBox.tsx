import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from '@/styles/Static.module.scss';
import uploadImagePreview from '@/images/elements/upload.svg';
import greenCheck from '@/images/elements/green-check.svg';
import readBtn from '@/images/elements/read-btn.svg';

import { getTrimmedPublicKey } from '@/lib/getTrimmedPublicKey';
import { SmallCheckIcon } from '@/images/dynamic/Step';
import { useEffect, useRef, useState } from 'react';
import { getUserSignature } from '@/lib/signMessage';
import { getAllUserDomains } from '@/lib/getAllUserDomains';
import { createNewProfile, getBackpackDomainProxied, getUserTwitter, verifyTwitterRequest } from '@/lib/networkRequests';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { createFreshProfile } from '@/lib/contractInteraction';
import { getUserNFTs } from '@/lib/getAllUserNFTs';
import { uploadPicture } from '@/lib/networkRequests';
import { CreateButton } from './Buttons';


export const OnboardingBox = ({
  setDone
}: { setDone: (done: boolean) => void }) => {

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [twitter, setTwitter] = useState('');
  const [blog_name, setBlogName] = useState('');
  const [username, setUsername] = useState('');

  const [step, setStep] = useState(2);
  const [refresher, setRefresher] = useState(0);
  const [nfts] = useState<Set<string>>(new Set());
  const [domains, setDomains] = useState<string[]>([]);
  const [waoDomain, setWAODomain] = useState('');
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
    (async function () {
      if (!publicKey) return;
      const owner_domain = await getBackpackDomainProxied(publicKey.toBase58());
      console.log('WAO Domain:', owner_domain);
      if (owner_domain) setWAODomain(owner_domain);
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

  // useEffect(() => {
  //   if (!publicKey) return;
  //   (async function () {
  //     const verified_twitter = await getUserTwitter(publicKey.toBase58());
  //     if (!verified_twitter) return;
  //     setTwitter(verified_twitter);
  //     setStep(2);
  //   })();
  // }, [publicKey]);


  const tabIsActive = (tab: number) => step === tab;
  const getTabClassName = (tab: number) => {
    if (tabIsActive(tab)) return styles.activeTab;
    return styles.tab;
  }

  const handleDomainChange = (domain: string) => setUsername(domain);

  const handleUploadButton = () => {
    // @ts-expect-error
    fileInputRef?.current?.click();
  }

  const handleSubmit = async () => {
    if (!publicKey || !signMessage || !wallet) return;
    const signature = await getUserSignature(signMessage, publicKey.toBase58());
    if (!signature) {
      toast('Please sign the message to authenticate your wallet');
      return;
    }
    if (!name || !blog_name || !image ||  username === '') {
      toast('Please enter your name, username, blog name and select an image');
      return;
    }
    const profile_hash = await createFreshProfile(wallet);
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
        {/* <div className={getTabClassName(1)}>
          {step === 1 && (
            <Step step={1} />
          )}
          {step === 2 && (
            <Done />
          )}
          <p className={`normal-text ml-3 sm ${tabIsActive(1) ? 'op-1' : ''}`}>Verify</p>
        </div> */}
        <div className={getTabClassName(2)}>
          {/* <Step step={2} /> */}
          <p className={`normal-text sm ${tabIsActive(2) ? 'op-1' : ''}`}>Setup your Profile</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      {(step === 1 || step === 2) && (
        <div className={styles.obBox}>
          <Header />
          {/* {step === 1 && (
            <div className={styles.obContent}>
              <p className="normal-text sm">What's your Twitter username?</p>
              <input
                onChange={(e) => setTwitter(e.target.value)}
                className="onboarding-input"
                placeholder="@wordcel_club"
              />
              <div className="mt-2">
                <button
                  onClick={handleTweetButton}
                  className="secondary-btn brdr"
                >
                  Tweet to verify
                </button>
                <button
                  onClick={handleTweetedButton}
                  className="secondary-btn brdr mt-1 inverse"
                >
                  I have tweeted
                </button>
              </div>
            </div>
          )} */}
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
                      const request = uploadPicture(file, walletContext);
                      toast.promise(request, {
                        loading: 'Uploading Image',
                        success: 'Image Uploaded',
                        error: 'Error Uploading Image'
                      });
                      const url = await request;
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
                {(domains.length > 0 || waoDomain) && (
                  <div className={styles.domainGrid}>
                    <div
                      onClick={() => handleDomainChange(waoDomain)}
                      className={styles.domain}
                      style={{ border: (username === waoDomain) ? '0.15rem solid var(--gray-500)' : '0.15rem solid var(--gray-300)' }}
                    >
                      <div
                        className={styles.domainSelectionCheck}
                        style={{ border: (username === waoDomain) ? 'none' : ''}}
                      >
                        {(username === waoDomain) && <SmallCheckIcon />}
                      </div>
                      <p className={`nm text weight-500 ${(username === waoDomain) ? 'gray-500' : 'gray-300'}`}>{
                        waoDomain.length > 20 ? `...${waoDomain.slice(waoDomain.length-18, waoDomain.length)}` : waoDomain
                      }</p>
                    </div>
                    {domains.map((domain) => {
                      const isActive = domain === username;
                      return (
                        <div
                          key={domain}
                          onClick={() => handleDomainChange(domain)}
                          className={styles.domain}
                          style={{ border: isActive ? '0.15rem solid var(--gray-500)' : '0.15rem solid var(--gray-300)' }}
                        >
                          <div
                            className={styles.domainSelectionCheck}
                            style={{ border: isActive ? 'none' : ''}}
                          >
                            {isActive && <SmallCheckIcon />}
                          </div>
                          <p className={`nm text weight-500 ${isActive ? 'gray-500' : 'gray-300'}`}>{
                            domain.length > 20 ? `...${domain.slice(domain.length-18, domain.length)}` : domain
                          }</p>
                        </div>
                      )
                    })}
                  </div>
                )}
                {(domains.length === 0 && !waoDomain) && (
                  <p className="normal-text sm">It seems like you don't have any domains, you need a .SOL or a backpack domain to sign up</p>
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
                disabled={!name || !blog_name || !image || username === ''}
              >Continue</button>

            </div>
          )}
        </div>
      )}
      {step === 3 && publicKey && (
        <div className={styles.stepThreeParent}>
          <img src={greenCheck.src} />
          <h1 className="text gray-700 weight-600 size-28 nm mt-3">{"You're all set"}</h1>
          <p className="text gray-400 weight-400 size-20 nm mt-1">The future of decentralized publishing begins now</p>
          <div className={styles.stepThreeContent}>
            <div className={styles.stepThreeProfile}>
              <img className={styles.stepThreeProfileImage} src={image} alt="" />
              <div className="ml-2">
                <p className="text gray-700 weight-600 size-28 nm">{name}</p>
                <p className="text gray-500 weight-400 size-20 nm mt-0-5">{username} • {getTrimmedPublicKey(publicKey.toBase58())}</p>
              </div>
            </div>
            <div className={styles.stepThreeLongBox}>
              <div className={styles.stepThreeBoxSection}>
                <div>
                  <p className="text gray-700 weight-600 size-20 nm">Create your first post</p>
                  <p className="text gray-400 weight-400 size-20 nm mt-0-5">Publish your first on-chain post</p>
                </div>
                <Link href="/dashboard/new">
                  <a className={styles.createButton}>
                    <CreateButton />
                  </a>
                </Link>
              </div>
              <div className={styles.stepThreeBoxSection}>
                <div>
                  <p className="text gray-700 weight-600 size-20 nm">See how it works</p>
                  <p className="text gray-400 weight-400 size-20 nm mt-0-5">Get a quick introduction to the platform</p>
                </div>
                <a href="/wordcelclub.sol/wordcel-reimagined" target="_blank" rel="noopener noreferrer">
                  <img src={readBtn.src} alt="Read Article" />
                </a>
              </div>
            </div>
          </div>
          <Link href={'/dashboard'}>
            <a>
              <p className="text gray-300 weight-400 size-24 nm mt-5">Skip to Dashboard</p>
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};
