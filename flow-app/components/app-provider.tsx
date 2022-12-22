import * as fcl from '@onflow/fcl';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as cadence from './cadence/cadence';

type FclUserType = {
  addr: string;
  cid: string;
  expiresAt: number;
  f_type: string;
  f_vsn: string;
  loggedIn: boolean;
};

export type NftType = {
  id: string;
  uuid: string;
  thumbnail: string;
  name: string;
};

const defaultState = {
  user: {
    addr: '',
    cid: '',
    expiresAt: 0,
    f_type: '',
    f_vsn: '',
    loggedIn: false,
  },
  nfts: [],
  setNFTs: () => {},
  fcl,
};

const AppProvider = createContext<{
  user: FclUserType | undefined;
  nfts: Array<NftType>;
  setNFTs: Dispatch<SetStateAction<NftType[] | []>>;
  fcl: typeof fcl;
}>(defaultState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<FclUser | undefined>();
  const [nfts, setNFTs] = useState<Nft[] | []>([]); // NEW

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const retrieveNFTs = useCallback(async () => {
    if (!user) return;
    const nfts = await fcl.query({
      cadence: cadence.cadenceScriptRetrieveNFTs,
      args: (arg, t) => [arg(user.addr, t.Address)],
    });
    console.log(nfts);
    setNFTs(nfts);
  }, [user]);

  useEffect(() => {
    if (user) {
      (async () => await retrieveNFTs())();
    }
  }, [retrieveNFTs, user]);

  return (
    <AppProvider.Provider value={{ user, nfts, setNFTs, fcl }}>
      {children}
    </AppProvider.Provider>
  );
};

export const useAppProvider = () => {
  const context = useContext(AppProvider);
  if (typeof context === undefined) {
    throw new Error('Must be used inside a Provider');
  }

  return context;
};
