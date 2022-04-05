import { MESSAGE_TO_SIGN } from '@/components/config/constants';

export const getUserSignature = async (
  sign: (message: Uint8Array) => Promise<Uint8Array>
) => {
  const localSignature = localStorage.getItem('wordcel_signature');
  if (localSignature) return JSON.parse(localSignature);
  const message = new TextEncoder().encode(MESSAGE_TO_SIGN);
  const signature = await sign(message);
  localStorage.setItem('wordcel_signature', JSON.stringify(signature));
  return signature;
};
