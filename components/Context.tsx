import {
  useEffect,
  useContext,
  createContext,
  useState,
  useRef
} from 'react';
import { EditorCore } from "@react-editor-js/core";
import { useWallet } from '@solana/wallet-adapter-react';
import { getUser } from '@/lib/networkRequests';
import { User } from '@prisma/client';

interface UserData {
  user: User | null;
}

interface EditorData {
  instance: EditorCore | null;
  initialize: (instance: any) => void;
  remove: () => void;
}

const UserContext = createContext<UserData | null>(null);
const EditorContext = createContext<EditorData | null>(null);

const UserProvider = ({ children }: any) => {
  const wallet = useWallet();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    (async function () {
      if (wallet.publicKey) {
        const _user = await getUser(wallet.publicKey.toBase58());
        if (_user) setUser(_user);
      }
    })();
    if (!wallet.publicKey) setUser(null);
  }, [wallet.publicKey]);

  return (
    <UserContext.Provider value={user as any}>
      {children}
    </UserContext.Provider>
  );
}

const EditorProvider = ({ children }: any) => {
  const [instance, setInstance] = useState<EditorCore | null>(null);

  const initialize = (instance_: any) => {
    setInstance(instance_);
  };
  const remove = () => {
    setInstance(null);
  };

  return (
    <EditorContext.Provider value={{
      instance,
      initialize,
      remove
    }}>
      {children}
    </EditorContext.Provider>
  );
}

const useEditor = () => useContext(EditorContext);
const useUser = () => useContext(UserContext);

export {
  useUser,
  UserProvider,
  useEditor,
  EditorProvider
};