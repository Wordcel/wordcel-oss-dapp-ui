import { Connection, PublicKey } from "@solana/web3.js";
import { NAME_PROGRAM_ID, performReverseLookup } from "@bonfida/spl-name-service";
import { CLUSTER } from "@/lib/config/constants";
import { clusterApiUrl } from "@/components/Wallet";

const SOL_TLD_AUTHORITY = new PublicKey(
  "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
);

export async function findOwnedNameAccountsForUser(
  userAccount: PublicKey
): Promise<PublicKey[]> {
  const rpcUrl = clusterApiUrl(CLUSTER);
  const connection = new Connection(rpcUrl);
  const filters = [
    {
      memcmp: {
        offset: 32,
        bytes: userAccount.toBase58(),
      },
    },
    {
      memcmp: {
        offset: 0,
        bytes: SOL_TLD_AUTHORITY.toBase58(),
      },
    }
  ];
  const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
    filters,
  });
  return accounts.map((a) => a.pubkey);
};

export async function getAllUserDomains (publicKey: PublicKey): Promise<string[]> {
  const domains: string[] = [];
  const rpcUrl = clusterApiUrl(CLUSTER);
  const connection = new Connection(rpcUrl);
  const domainKeys = await findOwnedNameAccountsForUser(publicKey);
  return new Promise((resolve, reject) => {
    domainKeys.forEach(async (key, index) => {
      try {
        const domain = await performReverseLookup(connection, key);
        domains.push(domain + '.sol');
        if (index === domainKeys.length - 1) {
          resolve(domains);
        }
      }
      catch (e) {
        console.log(e);
        if (index === domainKeys.length - 1) {
          resolve(domains);
        }
      }
    })
  })
};
