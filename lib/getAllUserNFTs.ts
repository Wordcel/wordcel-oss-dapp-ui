import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";

export const getUserNFTsMetadata = async (
  public_key: string
) => {
  try {
    const publicAddress = await resolveToWalletAddress({
      text: public_key
    });
    const nftArray = await getParsedNftAccountsByOwner({
      publicAddress,
    });
    return nftArray.map((nft) => nft.data.uri);
  } catch (error) {
    console.log("Error thrown, while fetching NFTs");
  }
}

export const getUserNFTs = async (
  public_key: string,
  pushNFT: (nft: string) => void
) => {
  const metadatas = await getUserNFTsMetadata(public_key);
  if (!metadatas || metadatas.length === 0) return;
  return Promise.all(metadatas.map(async (metadata) => {
    try {
      const request = await fetch(metadata);
      const response = await request.json();
      pushNFT(response.image);
      return response.image;
    }
    catch {
      return null
    }
  }))
};
