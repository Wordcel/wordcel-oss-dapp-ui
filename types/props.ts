export interface User {
  id: number;
  name: string;
  username: string;
  public_key: string;
  nft_key: string;
  blog_name: string;
}

export interface Article {
  id: number;
  title: string;
  description: string;
  image_url: string;
  on_chain: boolean;
  user_id: number;
  blocks?: string;
  proof_of_post?: string;
  arweave_url?: string;
  slug?: string
}

export interface GetUserServerSide {
  user?: User;
}

export interface GetArticlesServerSide {
  articles?: Article[];
  user?: User;
}

export interface GetArticleServerSide {
  article?: Article;
  user_public_key?: string;
  blocks?: string;
}