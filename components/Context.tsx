import {
  useEffect,
  useContext,
  createContext,
  useState,
} from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUser } from '@/lib/networkRequests';
import { User } from '@prisma/client';

interface UserData {
  user: User | null;
  fetched: boolean;
}

interface SidebarData {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}


const UserContext = createContext<UserData | null>(null);
const SidebarContext = createContext<SidebarData | null>(null);

const UserProvider = ({ children }: any) => {
  const wallet = useWallet();
  const [data, setData] = useState<null | UserData>(null);

  useEffect(() => {
    (async function () {
      if (wallet.publicKey) {
        const _user = await getUser(wallet.publicKey.toBase58());
        if (_user) {
          setData({ user: _user, fetched: true });
        } else {
          setData({ user: null, fetched: true });
        }
      }
    })();
    if (!wallet.publicKey) setData(null);
  }, [wallet.publicKey]);

  return (
    <UserContext.Provider value={data}>
      {children}
    </UserContext.Provider>
  );
}

const SidebarProvider = ({ children }: any) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  return (
    <SidebarContext.Provider value={{
      collapsed,
      setCollapsed
    }}>
      {children}
    </SidebarContext.Provider>
  );
}


const useUser = () => useContext(UserContext);
const useSidebar = () => useContext(SidebarContext);

export {
  useUser,
  UserProvider,
  useSidebar,
  SidebarProvider,
};