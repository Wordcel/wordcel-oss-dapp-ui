import {
  AddProfileHash,
  PublishArticleRequest,
  Connect,
  Draft
} from '@/types/api';
import * as anchor from '@project-serum/anchor';

export async function addProfileHash (
  data: AddProfileHash
) {
  const request = await fetch(
    '/api/user/create/profile',
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
  return response.user.profile_hash;
};

export async function getIfConnected(
  wallet: anchor.Wallet,
  profileOwner: string,
  returnResponse = false
) {
  const request = await fetch(`/api/connection/get/${wallet.publicKey.toBase58()}/${profileOwner}`);
  if (!returnResponse) return request.ok;
  const response = await request.json();
  return response;
};

export const updateDraft = async (
  data: Draft
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
