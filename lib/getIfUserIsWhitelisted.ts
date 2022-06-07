import * as anchor from '@project-serum/anchor';
import { NextRouter } from 'next/router';
import { getInviteAccount } from '@/components/invitationIntegration';
import { getUserExists } from '@/components/networkRequests';

export async function getIfWhitelisted(
  user_wallet: anchor.Wallet,
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
