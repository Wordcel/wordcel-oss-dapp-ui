import {
  AddPublicationHash,
  PublishArticleRequest,
  Subscribe
} from '@/types/api';
import * as anchor from '@project-serum/anchor';

export async function addPublicationHash (
  data: AddPublicationHash
) {
  const request = await fetch(
    '/api/user/create/publication',
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

export async function publishToServer(
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

export async function updateSubscriptionServer(
  data: Subscribe,
  cancel = false
) {
  const request = await fetch(
    cancel ? '/api/subscription/cancel' : '/api/subscription/new',
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

export async function getPublicationHash(
  public_key: string
) {
  const request = await fetch(`/api/user/get/${public_key}`);
  const response = await request.json();
  console.log(response);
  return response.user.publication_hash;
};

export async function getIfSubscribed(
  wallet: anchor.Wallet,
  publicationOwner: string,
  returnResponse = false
) {
  const request = await fetch(`/api/subscription/get/${wallet.publicKey.toBase58()}/${publicationOwner}`);
  if (!returnResponse) return request.ok;
  const response = await request.json();
  return response;
};
