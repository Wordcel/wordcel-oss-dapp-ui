export interface User {
  id: number;
  name: string;
  public_key: string;
  nft_key: string;
  blog_name: string;
}

export interface GetUserServerSide {
  user?: User;
}