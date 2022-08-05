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
}

interface SidebarData {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const UserContext = createContext<UserData | null>(null);
const SidebarContext = createContext<SidebarData | null>(null);

const UserProvider = ({ children }: any) => {
  const wallet = useWallet();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    (async function () {
      if (wallet.publicKey) {
        const _user = await getUser(wallet.publicKey.toBase58());
        if (_user) {
          setUser({ user: _user } as any);
        } else {
          setUser(null)
        }
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