// Module Imports
import Modal from 'react-modal';
import toast from 'react-hot-toast'
import ClickAwayListener from 'react-click-away-listener';

import { useEffect, useState, useRef } from 'react';
import { toasterPromise } from '@/lib/toasterNetworkRequest';

// Image Imports
import uploadImagePreview from '@/images/elements/upload.svg';

// Style Imports
import styles from '@/styles/EditProfile.module.scss';

// Type Imports
import { UpdatableUserDetails, UpdateUser } from '@/types/api';

// Component Imports
import { uploadImageBundlr } from '@/lib/uploadBundlr';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserSignature } from '@/lib/signMessage';
import { useRouter } from 'next/router';
import { SecondaryInput } from './Inputs';


const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '60rem',
    width: '100%',
    marginRight: '-50%',
    padding: '0rem',
    border: '0.15rem solid rgba(145, 172, 179, 0.35)',
    borderRadius: '1rem',
    transform: 'translate(-50%, -50%)',
  },
};

const publish = async (data: UpdateUser) => {
  try {
    const request = fetch(
      '/api/user/update',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    toast.promise(toasterPromise(request), {
      loading: 'Updating Profile',
      success: 'Profile Updated',
      error: 'Error Updating Profile'
    });
    const response = await request;
    return response;
  }
  catch (e) {
    console.log(e);
  }
};

const validate = (data: UpdatableUserDetails) => {
  if (!data.name) return 'Please enter a name';
  if (!data.bio) return 'Please enter your bio';
  if (!data.blog_name) return 'Please enter your blog\'s name';
  if (data.name.length > 70) return 'Please enter a name under 70 characters';
  if (data.bio.length > 140) return 'Please enter a bio less than 140 characters';
}

export const EditProfile = ({
  isOpen,
  setIsOpen,
  defaultData
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  defaultData: UpdatableUserDetails
}) => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [updateData, setUpdateData] = useState<UpdatableUserDetails>(defaultData);

  const { publicKey, signMessage } = useWallet();
  const walletContext = useWallet();

  const handlePublish = async () => {
    const errored = validate(updateData);
    if (errored) {
      toast.error(errored);
      return;
    }
    setIsOpen(false);
    if (!signMessage || !publicKey) return;
    const signature = await getUserSignature(signMessage, publicKey.toBase58());
    if (!signature) return;
    const data = await publish({
      ...updateData,
      public_key: publicKey.toBase58(),
      signature
    });
    router.replace(router.asPath);
  };

  useEffect(() => {
    Modal.setAppElement('#__next');
  }, []);

  const handleUploadButton = () => {
    // @ts-expect-error
    fileInputRef?.current?.click();
  }

  return (
    <div>
      <Modal
        isOpen={isOpen}
        style={modalStyles}
        contentLabel="Edit Profile"
      >
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
          <div className={styles.container}>
            <div className={styles.heroSection}>
              <p className="subheading sm navy nm">Edit your profile</p>
            </div>
            <div className={styles.form}>
              <div className={styles.formHeight}>
                <div>
                  <p className="input-label nm">Upload Profile Photo</p>
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
                        if (url) setUpdateData({ ...updateData, image_url: url });
                      }}
                    />
                    <img
                      className={styles.uploadPreview}
                      src={updateData.image_url ? updateData.image_url : uploadImagePreview.src}
                      alt=""
                    />
                    <button
                      onClick={handleUploadButton}
                      className={styles.uploadButton}
                    >Upload</button>
                  </div>
                </div>
                <SecondaryInput
                  placeHolder="Name"
                  label="Name"
                  value={updateData.name}
                  onChange={(e: any) => setUpdateData({ ...updateData, name: e.target.value })}
                />
                <SecondaryInput
                  textArea={true}
                  placeHolder="Bio"
                  label="Bio"
                  value={updateData.bio}
                  onChange={(e: any) => setUpdateData({ ...updateData, bio: e.target.value })}
                />
                <SecondaryInput
                  placeHolder="Blog Name"
                  label="Blog Name"
                  value={updateData.blog_name}
                  onChange={(e: any) => setUpdateData({ ...updateData, blog_name: e.target.value })}
                />
                <SecondaryInput
                  placeHolder="Twitter Username"
                  label="Twitter Username"
                  value={updateData.twitter}
                  onChange={(e: any) => setUpdateData({ ...updateData, twitter: e.target.value })}
                />
                <SecondaryInput
                  placeHolder="Discord Invite"
                  label="Discord Invite"
                  value={updateData.discord}
                  onChange={(e: any) => setUpdateData({ ...updateData, discord: e.target.value })}
                />
              </div>
              <button
                onClick={handlePublish}
                className="main-btn mt-2"
              >
                Update
              </button>
            </div>
          </div>
        </ClickAwayListener>
      </Modal>
    </div>
  )
};
