export interface User {
  id: number;
  name: string;
  username: string;
  public_key: string;
  nft_key: string;
  blog_name: string;
  import_enabled: boolean;
  subscriber_count?: number;
  bio?: string;
  twitter?: string;
  discord?: string;
  image_url?: string;
  banner_url?: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  image_url: string;
  on_chain: boolean;
  created_at: Date;
  on_chain_version: Date;
  cached_at: Date;
  user_id: number;
  cache_link?: string;
  blocks?: string;
  proof_of_post?: string;
  arweave_url?: string;
  slug?: string
}

export interface GetUserServerSide {
  user?: User;
  articles?: Article[];
}

export interface GetArticlesServerSide {
  articles?: Article[];
  user?: User;
}

export interface GetArticleServerSide {
  article?: Article;
  user_public_key?: string;
  username: string;
  blocks?: string;
  user?: User;
}