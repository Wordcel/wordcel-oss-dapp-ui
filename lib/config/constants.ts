import { PublicKey } from "@solana/web3.js";

export const MESSAGE_TO_SIGN = 'WORDCEL';

// Dedicated RPC Node
export const DEVNET_ENDPOINT = process.env.NEXT_PUBLIC_DEVNET_ENDPOINT || 'https://rpc.ankr.com/solana_devnet';

// Dedicated RPC Node
export const MAINNET_ENDPOINT = process.env.NEXT_PUBLIC_MAINNET_ENDPOINT || 'https://rpc.ankr.com/solana';

export const CLUSTER = 'mainnet-beta' as "devnet" | "mainnet-beta";
export const BUNDLR_DEVNET_ENDPOINT = 'https://devnet.bundlr.network';
export const BUNDLR_MAINNET_ENDPOINT = 'https://node1.bundlr.network';

// REPLACE WITH YOUR OWN OG IMAGE
export const DEFAULT_OG_IMAGE = 'https://arweave.net/DH2DiFPbWAl5zUBs5Z2fOi3fmMKHbs_zMA0sP6apa60';

// PROGRAM IDs

export const WORDCEL_DEVNET_PROGRAM_ID = new PublicKey('D9JJgeRf2rKq5LNMHLBMb92g4ZpeMgCyvZkd7QKwSCzg');

export const WORDCEL_MAINNET_PROGRAM_ID = new PublicKey('EXzAYHZ8xS6QJ6xGRsdKZXixoQBLsuMbmwJozm85jHp');


// Token Mint Addresses
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const DEVNET_USDC_MINT = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU';