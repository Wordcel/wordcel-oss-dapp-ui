import Modal from 'react-modal';
import styles from '@/styles/components/Tipping.module.scss';
import cashIcon from '@/images/icons/cash.svg';
import usdcIcon from '@/images/icons/usdc.svg';
import tippedIcon from '@/images/icons/tipped.svg';

import { MagicSpinner } from "react-spinners-kit";


const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    maxWidth: '41rem',
    width: '100%',
    height: "30rem",
    marginRight: '-50%',
    padding: '0rem',
    borderRadius: '1rem',
    transform: 'translate(-50%, -50%)',
  },
};

const texts: {
  [key: string]: {
    heading: string,
    subtext: string,
    status: string
  }
} = {
  started: {
    heading: "Please confirm transaction",
    subtext: "in your solana wallet",
    status: "Waiting for signature"
  },
  signed: {
    heading: "Sending Transaction",
    subtext: "to the solana network",
    status: "Waiting for response"
  },
  sent: {
    heading: "Confirming Transaction",
    subtext: "with the nodes",
    status: "Waiting for confirmation"
  },
  confirmed: {
    heading: "Successfully Tipped",
    subtext: "You've successfully tipped $1",
    status: "Successfully Tipped"
  },
}

function TipModal({
  status,
  setStatus
}: {
  status: string,
  setStatus: (s: string) => void
}) {
  const showModal = status !== 'dormant';

  return (
    <div>
      <Modal
        isOpen={showModal}
        style={modalStyles}
        contentLabel="Payment Status"
      >
        <div>
          <div className={styles.header}>
            <div className={styles.heroContent}>
              <img src={cashIcon.src} alt="" />
              <p className="text size-16 weight-500 gray-400 ml-2">Send a Tip</p>
            </div>
            <div className={styles.status}>
              <div>
                {status !== 'confirmed' && (
                  <MagicSpinner size={45} color={'#334254'} />
                )}
                {status === 'confirmed' && (
                  <img src={tippedIcon.src} alt="" />
                )}
              </div>
              {showModal && (
                <div>
                  <p className="text size-18 weight-600 gray-700 nm">{texts[status].heading}</p>
                  <p className="text size-16 weight-500 gray-400 nm mt-1">{texts[status].subtext}</p>
                </div>
              )}
            </div>
          </div>
          <div className={styles.body}>
            <h1 className="text size-30 weight-600 gray-800 nm">$1</h1>
            <div className={styles.usdc}>
              <img src={usdcIcon.src} alt="" />
              <p className="text size-16 weight-600 gray-600 nm">USDC</p>
            </div>
            {showModal && (
              <p className="text size-16 weight-600 gray-400 nm mt-1-5">{texts[status].status}</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );

};

export { TipModal }