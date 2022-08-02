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

const UserContext = createContext<UserData | null>(null);

const UserProvider = ({ children }: any) => {
  const wallet = useWallet();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    (async function () {
      if (wallet.publicKey) {
        const _user = await getUser(wallet.publicKey.toBase58());
        if (_user) setUser({
          user: _user
        } as any);
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

const useUser = () => useContext(UserContext);

export {
  useUser,
  UserProvider
};