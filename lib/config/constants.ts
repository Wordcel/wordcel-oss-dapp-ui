import { PublicKey } from "@solana/web3.js";

export const ALGOLIA_APPLICATION_ID = 'L7IX5NUB4W';
export const MESSAGE_TO_SIGN = 'WORDCEL';

// export const ENDPOINT = 'https://devnet.genesysgo.net/';
// Dedicated RPC Node
//export const DEVNET_ENDPOINT = 'https://wild-shy-sea.solana-devnet.quiknode.pro/';
export const DEVNET_ENDPOINT = 'https://api.devnet.solana.com/';

// Dedicated RPC Node
export const MAINNET_ENDPOINT = 'https://crimson-patient-silence.solana-mainnet.quiknode.pro/5f5a55cc4a967286e0868cd78e2eedf0e8bcc234/';

export const CLUSTER = 'mainnet-beta' as "devnet" | "mainnet-beta"
export const BUNDLR_DEVNET_ENDPOINT = 'https://devnet.bundlr.network';
export const BUNDLR_MAINNET_ENDPOINT = 'https://node1.bundlr.network';

export const WHITELIST_URL = 'https://tally.so/r/w2d59m';
export const DEFAULT_OG_IMAGE = 'https://arweave.net/DH2DiFPbWAl5zUBs5Z2fOi3fmMKHbs_zMA0sP6apa60';

// PROGRAM IDs

export const WORDCEL_DEVNET_PROGRAM_ID = new PublicKey('D9JJgeRf2rKq5LNMHLBMb92g4ZpeMgCyvZkd7QKwSCzg');

export const WORDCEL_MAINNET_PROGRAM_ID = new PublicKey('EXzAYHZ8xS6QJ6xGRsdKZXixoQBLsuMbmwJozm85jHp');


// Token Mint Addresses
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const DEVNET_USDC_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';