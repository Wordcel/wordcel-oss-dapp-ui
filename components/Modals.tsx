import Modal from 'react-modal';
import ClickAwayListener from 'react-click-away-listener';

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
        <ClickAwayListener onClickAway={() => {
          setStatus('dormant')
        }}>
          <div></div>
        </ClickAwayListener>
      </Modal>
    </div>
  );
};

export { TipModal }