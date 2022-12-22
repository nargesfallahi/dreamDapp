import { Button, Grid } from '@chakra-ui/react';
// import * as fcl from '@onflow/fcl';
import { useState } from 'react';
import { useAppProvider } from './app-provider';
import * as cadence from './cadence/cadence';
import { Nft } from './nft';

export const AuthedState = () => {
  const { user, nfts, setNFTs, fcl } = useAppProvider();
  const [name, setName] = useState(''); // NEW
  const [selectedNFTs, setSelectedNFTs] = useState([]);

  // min super NFTs
  const mintSuperNFT = async () => {
    const transactionId = await fcl.mutate({
      cadence: cadence.cadenceTransactionMintSuperNFT,
      args: (arg: any, t: any) => [arg(selectedNFTs, t.Array(t.UInt64))],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });

    const transaction = await fcl.tx(transactionId).onceSealed();
    console.log(transaction);

    const nfts = await fcl.query({
      cadence: cadence.cadenceScriptRetrieveNFTs,
      args: (arg: any, t: any) => [arg(user?.addr, t.Address)],
    });

    setNFTs(nfts);
  };

  const handleSelectedNFTChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedNFTs((prevState) => [...prevState, value]);
    } else {
      setSelectedNFTs((prevState) => prevState.filter((n) => n !== value));
    }
  };

  return (
    <>
      <Button onClick={mintSuperNFT}>Mint SUPER NFT</Button>
      <Grid
        templateColumns={['auto', 'auto', '1fr 1fr', 'repeat(3, 302px)']}
        gap={'16px'}
      >
        {nfts.map((nft) => (
          <Nft
            key={nft.id + nft.name + 'upper'}
            nft={nft}
            selectNft={handleSelectedNFTChange}
            isChecked={selectedNFTs.includes(nft.id)}
          />
        ))}
      </Grid>
    </>
  );
};
