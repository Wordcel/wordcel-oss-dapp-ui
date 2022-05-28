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
  created_at: Date;
  user_id: number;
  on_chain: boolean;
  blocks?: string;
  proof_of_post?: string;
  arweave_url?: string;
  slug?: string
}

export interface Draft {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: Date;
  blocks?: string;
}

export interface GetUserServerSide {
  user?: User;
  articles?: Article[];
}

export interface GetArticlesServerSide {
  articles?: Article[];
  user?: User;
}

export interface GetDraftsServerSide {
  drafts?: Draft[];
  user?: User;
}

export interface DashboardSSR {
  user?: User;
  articles?: Article[];
  drafts?: Draft[];
}

export interface GetArticleServerSide {
  article?: Article;
  user_public_key?: string;
  username: string;
  blocks?: string;
  user?: User;
}

export interface GetDraftServerSide {
  draft?: Draft;
  blocks?: string;
  user?: User;
}