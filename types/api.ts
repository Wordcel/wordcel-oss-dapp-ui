export interface PublishArticleRequest {
  id: string | undefined;
  arweave_url: string;
  public_key: string;
  signature: Uint8Array;
  proof_of_post: string;
}

export interface Subscribe {
  account: string;
  publication_owner: string;
  public_key: string;
  signature: Uint8Array;
}

export interface UpdateCache {
  id: string;
  cache_link: string;
  public_key: string;
  signature: Uint8Array;
}