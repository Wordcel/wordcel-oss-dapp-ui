import Arweave from 'arweave';
import { NFTStorage } from 'nft.storage';
import { OutputData } from "@editorjs/editorjs";
import toast from 'react-hot-toast';

export interface ContentPayload {
  content: OutputData,
  type: string
}

export async function uploadArweave(data: ContentPayload) {
  const arweave = Arweave.init({
    host: window.location.host.includes('localhost') ? undefined : 'arweave.net'
  });
  const key = await arweave.wallets.generate();
  const transaction = await arweave.createTransaction({
    "data": JSON.stringify(data)
  }, key);
  transaction.addTag('Content-Type', 'application/json');
  await arweave.transactions.sign(transaction, key);
  const { id } = transaction;
  const uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
  }
  return `https://arweave.net/${id}`
};

export const uploadNFTStorage = async (
  data: ContentPayload,
) => {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3NmI0N0ZlQUNlRDEzOTIyMTZBMzkwZmE4Yjg0RWI0MzYxN2M1NzAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MDQ3NTk4MjAyNiwibmFtZSI6IndvcmRjZWwifQ.j0uYNFmg0N3ujJtTEYmw320m32xWzdKcGoTVidMtqNA";
    const client = new NFTStorage({ token });
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const cid = await client.storeBlob(new Blob([dataBuffer]));
    const link = `https://${cid}.ipfs.dweb.link`;
    console.log(`🎉 Uploaded data: ${link}`);
    return link;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};


export const uploadFile = async (image: File) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk3NmI0N0ZlQUNlRDEzOTIyMTZBMzkwZmE4Yjg0RWI0MzYxN2M1NzAiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MDQ3NTk4MjAyNiwibmFtZSI6IndvcmRjZWwifQ.j0uYNFmg0N3ujJtTEYmw320m32xWzdKcGoTVidMtqNA";
  const client = new NFTStorage({ token });
  const request = client.store({
    name: 'My Profile Picture',
    description: 'Just try to funge it. You can\'t do it.',
    image,
  });
  toast.promise(request, {
    loading: 'Uploading Image',
    success: 'Image Uploaded',
    error: 'Image Upload Failed'
  })
  const metadata = await request;
  const url = metadata.embed().image.toString();
  console.log(url);
  return url;
};