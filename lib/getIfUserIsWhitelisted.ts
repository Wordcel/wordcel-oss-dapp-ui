import { NextRouter } from 'next/router';
import { getInviteAccount } from '@/lib/invitationIntegration';
import { getUserExists } from '@/lib/networkRequests';
import { AnchorWallet } from '@solana/wallet-adapter-react';

export async function getIfWhitelisted(
  user_wallet: AnchorWallet,
  router: NextRouter
) {
  const user_exists = await getUserExists(user_wallet.publicKey.toBase58());
  if (user_exists) return true;
  try {
    await getInviteAccount(user_wallet);
    router.push('/onboarding');
    return true;
  } catch {
    return false;
  }
};
