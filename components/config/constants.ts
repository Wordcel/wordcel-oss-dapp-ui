import { PublicKey } from "@solana/web3.js";


export const MESSAGE_TO_SIGN = 'WORDCEL';

// export const ENDPOINT = 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/';
// Dedicated RPC Node
export const ENDPOINT = 'https://wild-shy-sea.solana-devnet.quiknode.pro/';

// Dedicated RPC Node
export const MAINNET_ENDPOINT = 'https://crimson-patient-silence.solana-mainnet.quiknode.pro/5f5a55cc4a967286e0868cd78e2eedf0e8bcc234/';

export const CLUSTER = 'mainnet-beta';
export const BUNDLR_DEVNET_ENDPOINT = 'https://devnet.bundlr.network';
export const BUNDLR_MAINNET_ENDPOINT = 'https://node1.bundlr.network';

export const WHITELIST_URL = 'https://tally.so/r/w2d59m';
export const DEFAULT_OG_IMAGE = 'https://bafkreielxpcbzu7nmn7dctpyxwfshjwfgx7f3357k4jvz77gbvxk3oasim.ipfs.nftstorage.link/';

// PROGRAM IDs

export const WORDCEL_DEVNET_PROGRAM_ID = new PublicKey('D9JJgeRf2rKq5LNMHLBMb92g4ZpeMgCyvZkd7QKwSCzg');
export const INVITATION_DEVNET_PROGRAM_ID = new PublicKey('6G5x4Es2YZYB5e4QkFJN88TrfLABkYEQpkUH5Gob9Cut');

export const WORDCEL_MAINNET_PROGRAM_ID = new PublicKey('EXzAYHZ8xS6QJ6xGRsdKZXixoQBLsuMbmwJozm85jHp');
export const INVITATION_MAINNET_PROGRAM_ID = new PublicKey('Fc4q6ttyDHr11HjMHRvanG9SskeR24Q62egdwsUUMHLf');
