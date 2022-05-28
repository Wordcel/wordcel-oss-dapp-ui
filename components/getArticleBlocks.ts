export const getBlocks = async (
  arweave_url: string
) => {
  try {
    const request = await fetch(arweave_url);
    const data = await request.json();
    return data.content.blocks;
  } catch (e) {
    console.error(e);
  }
};
