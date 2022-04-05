import Arweave from 'arweave';
import { OutputData } from "@editorjs/editorjs";

export interface ContentPayload {
  content: OutputData,
  type: string
}

export async function uploadArweave(data: ContentPayload) {
  const arweave = Arweave.init({});
  let key = await arweave.wallets.generate();
  let transaction = await arweave.createTransaction({
    "data": JSON.stringify(data)
  }, key);
  transaction.addTag('Content-Type', 'application/json');
  await arweave.transactions.sign(transaction, key);
  const { id } = transaction;
  let uploader = await arweave.transactions.getUploader(transaction);
  while (!uploader.isComplete) {
    await uploader.uploadChunk();
    console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
  }
  return `https://arweave.net/${id}`
}