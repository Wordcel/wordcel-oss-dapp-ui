export interface PublishArticleRequest {
  id: string | undefined;
  arweave_url: string;
  public_key: string;
  signature: Uint8Array;
  proof_of_post: string;
}