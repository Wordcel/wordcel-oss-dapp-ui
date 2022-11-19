import { PublicKey } from "@solana/web3.js";

export const timeout = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getFirstName = (fullName?: string) => {
  return fullName?.split(" ")[0];
};

export const numformat = (n: number) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};

export const validateSolanaAddress = (addr: string) => {
  let publicKey: PublicKey;
  try {
    publicKey = new PublicKey(addr);
    return PublicKey.isOnCurve(publicKey.toBytes());
  } catch (err) {
    return false;
  }
};
