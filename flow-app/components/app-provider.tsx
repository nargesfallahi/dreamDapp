import * as fcl from '@onflow/fcl';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import '../flow/config';
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
  metadata: {
    minter: string;
    type: 'RegularNFT' | 'SuperNFT';
  };
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
  superNfts: [],
  nonSuper: [],
  setNFTs: () => {},
  fcl,
};

const AppProvider = createContext<{
  user: FclUserType | undefined;
  nfts: NftType[];
  superNfts: NftType[];
  nonSuper: NftType[];
  setNFTs: Dispatch<SetStateAction<NftType[] | []>>;
  fcl: typeof fcl;
}>(defaultState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<FclUserType | undefined>();
  const [nfts, setNFTs] = useState<NftType[] | []>([]); // NEW

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  const retrieveNFTs = useCallback(async () => {
    if (!user) return;
    const nfts = await fcl.query({
      cadence: cadence.cadenceScriptRetrieveNFTs,
      args: (arg: any, t: any) => [arg(user.addr, t.Address)],
    });
    console.log(nfts);
    setNFTs(nfts);
  }, [user]);

  useEffect(() => {
    if (user) {
      (async () => await retrieveNFTs())();
    }
  }, [retrieveNFTs, user]);

  const superNfts = useMemo(
    () => (nfts ?? []).filter((nft) => nft.metadata.type === 'SuperNFT'),
    [nfts],
  );

  const nonSuper = useMemo(
    () => (nfts ?? []).filter((nft) => nft.metadata.type !== 'SuperNFT'),
    [nfts],
  );

  return (
    <AppProvider.Provider
      value={{ user, nfts, superNfts, nonSuper, setNFTs, fcl }}
    >
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
