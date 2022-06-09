import { MAINNET_ENDPOINT } from "@/components/config/constants";
import {
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from "@bonfida/spl-name-service";
import { Connection, PublicKey } from "@solana/web3.js";

export const SOL_TLD_AUTHORITY = new PublicKey(
  "58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx"
);

export const verifySolDomain = async (
  public_key: string,
  domain: string
) => {
  const connection = new Connection(MAINNET_ENDPOINT);
  const domain_name = domain.replace('.sol', '');
  const hashed_name = await getHashedName(domain_name);
  const domain_key = await getNameAccountKey(
    hashed_name,
    undefined,
    SOL_TLD_AUTHORITY
  );
  const { registry } = await NameRegistryState.retrieve(
    connection,
    domain_key
  );
  console.log(registry.owner?.toBase58());
  if (!registry?.owner) return false;
  return registry.owner.toBase58() === public_key;
};
