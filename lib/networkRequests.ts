import {
  PublishArticleRequest,
  Connect,
  UpdateDraft,
  NewProfile,
} from '@/types/api';
import { Draft } from '@/types/props';
import crypto from 'crypto';
import BigNumber from 'bignumber.js';
import { User } from '@prisma/client';
import { BUNDLR_DEVNET_ENDPOINT, BUNDLR_MAINNET_ENDPOINT, CLUSTER } from './config/constants';
import { Article } from '@/types/props';
import { Connection, PublicKey, ParsedAccountData } from '@solana/web3.js'
import { WalletContextState } from '@solana/wallet-adapter-react';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@/components/Wallet';
import { BundlrService } from './bundlrService';
import axios from 'axios';

export async function publishToServer (
  data: PublishArticleRequest
) {
  const request = await fetch(
    data.id ? '/api/publish' : '/api/publish/new',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const response = await request.json();
  return response;
};

export async function updateConnectionServer (
  data: Connect,
  cancel = false
) {
  const request = await fetch(
    cancel ? '/api/connection/cancel' : '/api/connection/new',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const response = await request.json();
  return response;
};

export async function getProfileHash (
  public_key: string
) {
  const request = await fetch(`/api/user/get/${public_key}`);
  const response = await request.json();
  console.log(response);
  return response.profile_hash;
};

export async function getIfConnected(
  wallet: AnchorWallet,
  profileOwner: string,
  returnResponse = false
) {
  const request = await fetch(`/api/connection/get/${wallet.publicKey.toBase58()}/${profileOwner}`);
  if (!returnResponse) return request.ok;
  const response = await request.json();
  return response;
};

export const updateDraft = async (
  data: UpdateDraft
) => {
  console.log(data);
  const request = await fetch(
    '/api/draft',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const response = await request.json();
  return response;
};

export const deleteDraft = async ({
  id,
  public_key,
  signature
}: {
  id: string | undefined;
  public_key: string | undefined;
  signature: Uint8Array;
}) => {
  if (!id || !public_key) return;
  const request = await fetch(
    '/api/draft/delete',
  {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id,
      public_key,
      signature
    })
  });
  const response = await request.json();
  return response;
};

export async function getUserExists (
  public_key: string
) {
  try {
    const request = await fetch('/api/user/get/' + public_key);
    return request.ok;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export async function getUser (
  public_key: string
): Promise<User | null> {
  try {
    const request = await fetch('/api/user/get/' + public_key);
    const response = await request.json();
    return response.error ? null : response;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function verifyTwitterRequest (
  public_key: string,
  username: string,
  signature: Uint8Array
) {
  const request = await fetch(
    '/api/twitter/verify',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      public_key,
      username,
      signature
    })
  });
  if (request.ok) return true;
  throw new Error('Invalid request');
};

export async function createNewProfile (
  data: NewProfile
) {
  const request = await fetch(
    '/api/user/new',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (request.ok) return true;
  throw new Error('Invalid request');
};

export async function getBundlrBalance (
  public_key: string
) {
  const bundlrUrl = CLUSTER === 'devnet' ? BUNDLR_DEVNET_ENDPOINT : BUNDLR_MAINNET_ENDPOINT;
  try {
    const request = await fetch(bundlrUrl + '/account/balance/solana?address=' + public_key);
    const response = await request.json();
    const balance = new BigNumber(response.balance);
    return balance;
  } catch (e) {
    console.error(e);
    return new BigNumber(0);
  }
};

export async function getUserTwitter (
  public_key: string
) {
  try {
    const request = await fetch('/api/twitter/' + public_key);
    const response = await request.json();
    return response.username;
  }
  catch {
    return undefined
  }
};

export async function getAllArticles (
  public_key: string
): Promise<Article[] | undefined> {
  try {
    const request = await fetch('/api/articles/' + public_key);
    const response = await request.json();
    return response;
  }
  catch {
    return undefined
  }
};

export async function getAllDrafts (
  public_key: string
): Promise<Draft[] | undefined> {
  try {
    const request = await fetch('/api/drafts/' + public_key);
    const response = await request.json();
    return response;
  }
  catch {
    return undefined
  }
}

export async function addTip (
  from: string,
  to: string,
  txid: string
) {
  try {
    const request = await fetch(
      '/api/tip/new',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        public_key: from,
        to_user: to,
        txid
      })
    });
  } catch (e) {
    console.error(e)
  }
}

export async function uploadUsingURL(
  wallet: WalletContextState,
  url: string,
) {
  try {
    // Get image data from URL
    const imageData = await axios.get(url, { responseType: 'arraybuffer' });
    const file = new File([imageData.data], 'image.png', { type: imageData.headers['content-type'] });
    const bundlrUploader = new BundlrService(wallet);
    const response = await bundlrUploader.uploadImage(file);
    return response.url;
  } catch (e) {
    console.error(e)
  }
}

export async function getTipDestination (txid: string) {
  const rpcUrl = clusterApiUrl(CLUSTER);
  const connection = new Connection(rpcUrl);
  const data = {
    method: 'getTransaction',
    jsonrpc: '2.0',
    id: crypto.randomBytes(32).toString('hex'),
    params: [
      txid,
      { encoding: 'jsonParsed', commitment: 'confirmed' }
    ],
  };
  const res = await fetch(rpcUrl, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {"Content-Type": "application/json"}
  });
  const response = await res.json();
  const instructions = response.result.transaction.message.instructions;
  const transfer_instructions = instructions.filter((i: any) => i.parsed.type === "transfer");
  const destination = transfer_instructions[0].parsed.info.destination;
  const tokenAccountInfo = await connection.getParsedAccountInfo(
    new PublicKey(destination)
  );
  const accountInfo = (tokenAccountInfo.value?.data as ParsedAccountData).parsed.info;
  return accountInfo.owner;
}

export async function uploadJSON (
  data: any,
  tags: { name: string, value: string }[],
  wallet: WalletContextState,
) {
  const bundlrUploader = new BundlrService(wallet);
  const response = await bundlrUploader.uploadData(data, tags);
  return response;
}

export async function uploadPicture (
  file: File,
  wallet: WalletContextState
) {
  const bundlrUploader = new BundlrService(wallet);
  const response = await bundlrUploader.uploadImage(file);
  return response.url;
}

export async function getBackpackDomain (public_key: string) {
  try {
    const url = `https://xnft-api-server.xnfts.dev/v1/users/fromPubkey?publicKey=${public_key}&blockchain=solana`;
    const request = await fetch(url);
    if (!request.ok) {
      console.error(`Request failed with status ${request.status}`);
      const text = await request.text();  // try to read the response body as text
      console.error(`Response body: ${text}`);
      return undefined;
    }
    const response = await request.json();
    return response.user.username + '.wao';
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export async function getBackpackDomainProxied (
  public_key: string
) {
  try {
    const request = await fetch('/api/wao/get/' + public_key);
    const response = await request.json();
    return response.username;
  } catch (e) {
    console.error(e);
    return undefined
  }
};

export async function getBackpackDomainOwner (
  domain: string
) {
  try {
    const request = await fetch(`https://auth.xnfts.dev/users/${domain.split('.')[0]}/info`);
    const response = await request.json();
    const address = response.publicKeys.filter((p: any) => p.blockchain === 'solana')[0].publicKey;
    return address;
  } catch (e) {
    console.error(e);
    return undefined
  }
}

export async function fetchUserArticles (
  public_key: string,
  page: number
) {
  try {
    const skip = (page - 1) * 10;
    const take = 10;
    const request = await fetch('/api/articles/' + public_key + '?skip=' + skip + '&take=' + take);
    const response = await request.json();
    return response;
  } catch (e) {
    console.error(e);
    return [];
  }
}