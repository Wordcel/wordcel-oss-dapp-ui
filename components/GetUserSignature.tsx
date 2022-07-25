import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getUserSignature } from '@/lib/signMessage';


export const GetUserSignature = ({
  setSignature
}: {
  setSignature: (signature: Uint8Array) => void;
}) => {
  const { publicKey, signMessage } = useWallet();
  useEffect(() => {
    (async function () {
      if (publicKey && signMessage) {
        const userSignature = await getUserSignature(
          signMessage,
          publicKey.toBase58(),
          true
        );
        if (userSignature) setSignature(userSignature);
      }
    })();
  }, []);
  return <></>;
}