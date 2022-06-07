import * as anchor from '@project-serum/anchor';
import { getInviteAccount } from '@/components/invitationIntegration';

export async function getIfWhitelisted(
  user_wallet: anchor.Wallet
) {
  try {
    await getInviteAccount(user_wallet);
    return true;
  } catch {
    return false;
  }
};
