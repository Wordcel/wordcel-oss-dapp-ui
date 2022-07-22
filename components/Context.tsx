import {
  useEffect,
  useContext,
  createContext,
  useState
} from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUser } from '@/lib/networkRequests';
import { User } from '@prisma/client';

interface Data {
  user: User | null;
}

const Context = createContext<Data | null>(null);

const Provider = ({ children }: any) => {
  const wallet = useWallet();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    (async function () {
      if (wallet.publicKey) {
        const _user = await getUser(wallet.publicKey.toBase58());
        if (_user) setUser(_user);
      }
    })();
  }, [wallet.publicKey]);

  return (
    <Context.Provider value={user as any}>
      {children}
    </Context.Provider>
  );
}

export default Provider;

export const useUser = () => useContext(Context);