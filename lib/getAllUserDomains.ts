import { Connection, PublicKey } from "@solana/web3.js";
import { NAME_PROGRAM_ID, performReverseLookup } from "@bonfida/spl-name-service";
import { MAINNET_ENDPOINT } from "@/components/config/constants";

export async function findOwnedNameAccountsForUser(
  userAccount: PublicKey
): Promise<PublicKey[]> {
  const connection = new Connection(MAINNET_ENDPOINT);
  const filters = [
    {
      memcmp: {
        offset: 32,
        bytes: userAccount.toBase58(),
      },
    },
  ];
  const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
    filters,
  });
  return accounts.map((a) => a.pubkey);
};

export async function getAllUserDomains (
  publicKey: PublicKey,
  getFromStorage = true
): Promise<string[]> {
  if (getFromStorage) {
    const local_domains = localStorage.getItem('domains');
    if (local_domains) return JSON.parse(local_domains);
  }
  const domains: string[] = [];
  const connection = new Connection(MAINNET_ENDPOINT);
  const domainKeys = await findOwnedNameAccountsForUser(publicKey);
  return new Promise((resolve, reject) => {
    domainKeys.forEach(async (key, index) => {
      const domain = await performReverseLookup(connection, key);
      domains.push(domain + '.sol');
      if (index === domainKeys.length - 1) {
        localStorage.setItem('domains', JSON.stringify(domains));
        resolve(domains);
      }
    })
  })
};
