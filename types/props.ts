export interface User {
  id: number;
  name: string;
  username: string;
  public_key: string;
  blog_name: string;
  tip_enabled: boolean;
  connection_count?: number;
  profile_hash?: string;
  bio?: string;
  twitter?: string;
  discord?: string;
  image_url?: string;
  banner_url?: string;
  invited_by: { name: string; username: string } | null;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  image_url: string;
  views: number;
  created_at: Date;
  user_id: number;
  on_chain: boolean;
  blocks?: string;
  proof_of_post?: string;
  arweave_url?: string;
  slug?: string
}

export interface ArticleWithOwner extends Article {
  owner: User
}

export interface Draft {
  id: number;
  title: string;
  description: string;
  image_url: string;
  source: string;
  created_at: Date;
  updated_at: Date;
  share_hash?: string;
  blocks?: string;
}

export interface GetUserServerSide {
  user?: User;
  post_count?: number;
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
  contentDigest?: string;
}

export interface GetDraftServerSide {
  draft?: Draft;
  blocks?: string;
  user?: User;
}