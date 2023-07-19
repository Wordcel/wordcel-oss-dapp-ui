export interface PublishArticleRequest {
  id: string | undefined;
  arweave_url: string;
  public_key: string;
  signature: Uint8Array;
  proof_of_post: string;
}

export interface Connect {
  account: string;
  profile_owner: string;
  public_key: string;
  signature: Uint8Array;
}

export interface UpdateDraft {
  id: string | undefined;
  blocks: any;
  public_key: string;
  signature: Uint8Array;
}

export interface UpdatableUserDetails {
  name?: string | null;
  bio?: string | null;
  blog_name?: string | null;
  image_url?: string | null;
  twitter?: string | null;
  discord?: string | null;
  tip_enabled?: boolean;
}

export interface UpdateUser extends UpdatableUserDetails {
  public_key: string;
  signature: Uint8Array;
}

export interface NewProfile {
  name: string;
  public_key: string;
  username: string;
  blog_name: string;
  image_url: string;
  profile_hash: string;
  signature: Uint8Array;
  twitter?: string;
}

