import { useEffect } from "react";
import { saveToast } from "@/lib/saveToast";
import { useWallet } from "@solana/wallet-adapter-react";
import { updateDraft } from "@/lib/networkRequests";

export const AutoSaveToast = () => {
  useEffect(() => {
    const eventListener = (e: KeyboardEvent) => {
      if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        saveToast();
      }
    }
    if (typeof document !== 'undefined') {
      document.addEventListener("keydown", eventListener);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener("keydown", eventListener);
      }
    }
  }, []);
  return <></>;
}

export const AutoSaveArticle = ({
  draft_id,
  signature,
  editorInstance,
  publishClicked
}: {
  draft_id: string;
  signature: Uint8Array;
  editorInstance: any;
  publishClicked: boolean;
}) => {
  const { publicKey } = useWallet();
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!editorInstance.current?.save || !publicKey || !signature || publishClicked) return;
      const data = await editorInstance.current.save();
      const response = await updateDraft({
        id: draft_id,
        blocks: data.blocks,
        signature: signature,
        public_key: publicKey.toBase58()
      });
      console.log(response);
      draft_id = response?.draft?.id;
    }, 8000);
    return () => {
      clearInterval(interval);
    }
  }, [signature]);
  return <></>;
}