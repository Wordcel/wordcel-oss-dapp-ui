import toast from 'react-hot-toast';
import { MESSAGE_TO_SIGN } from '@/components/config/constants';

export const getUserSignature = async (
  sign: (message: Uint8Array) => Promise<Uint8Array | undefined>,
  public_key: string,
  saveToast = false
): Promise<Uint8Array | undefined> => {
  try {
    let to_return_signature;
    const localSignature = localStorage.getItem('wordcel_signature');
    const localPublicKey = localStorage.getItem('wordcel_public_key');
    if (localSignature && localPublicKey && localPublicKey === public_key) {
      to_return_signature = JSON.parse(localSignature)
    };
    if (to_return_signature) return to_return_signature;
    const message = new TextEncoder().encode(MESSAGE_TO_SIGN);
    const toastMessage = saveToast ? 'save your progress' : 'authenticate your wallet address';
    toast('Please sign a message to ' + toastMessage);
    const signature = await sign(message);
    if (!signature) return undefined;
    localStorage.setItem('wordcel_public_key', public_key);
    localStorage.setItem('wordcel_signature', JSON.stringify(signature));
    return signature;
  }
  catch {
    console.log('User rejected message signature request');
  }
};
