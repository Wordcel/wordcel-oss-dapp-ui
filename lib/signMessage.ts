import { MESSAGE_TO_SIGN } from '@/components/config/constants';
import toast from 'react-hot-toast';

export const getUserSignature = async (
  sign: (message: Uint8Array) => Promise<Uint8Array | undefined>
): Promise<Uint8Array | undefined> => {
  const localSignature = localStorage.getItem('wordcel_signature');
  if (localSignature) return JSON.parse(localSignature);
  const message = new TextEncoder().encode(MESSAGE_TO_SIGN);
  toast('Please sign a message to authenticate your wallet address');
  const signature = await sign(message);
  localStorage.setItem('wordcel_signature', JSON.stringify(signature));
  return signature;
};
