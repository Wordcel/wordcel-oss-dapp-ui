export const getBlocks = async (
  arweave_url: string,
  getResponse = false
) => {
  try {
    const request = await fetch(arweave_url);
    const data = await request.json();
    if (getResponse) return data;
    return data.content.blocks;
  } catch (e) {
    console.error(e);
  }
};
