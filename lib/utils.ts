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

function getRandomTweet() {
  const tweets = [
    "I'm dying to get my hands on this invite-only platform! Can someone hook me up?",
    "I'm not begging, I'm just strongly suggesting that someone send me an invite to this exclusive platform.",
    "I'll do a happy dance if someone sends me an invite to this exclusive platform.",
    "I've been dreaming about joining this invite-only platform. Can someone make my dream come true?",
    "I'll bake you cookies if you send me an invite to this exclusive platform.",
    "I'll do your laundry for a month if you send me an invite to this invite-only platform.",
    "I'll name my firstborn child after you if you send me an invite to this exclusive platform.",
    "I'll sing you a personalized love song if you send me an invite to this invite-only platform.",
    "I'll do a handstand in public if you send me an invite to this exclusive platform."
  ];
  return tweets[Math.floor(Math.random() * tweets.length)];
}

export const requestInviteURL = () => {
  const tweet = getRandomTweet();
  const encodedTweet = encodeURIComponent(`${tweet}\n\nhttps://wordcelclub.com\n\n@wordcel_club`);
  return `https://twitter.com/intent/tweet?text=${encodedTweet}`;
}