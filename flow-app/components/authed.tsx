import { Button, Grid } from '@chakra-ui/react';
// import * as fcl from '@onflow/fcl';
import { useState } from 'react';
import { useAppProvider } from './app-provider';
import * as cadence from './cadence/cadence';
import { Nft } from './nft';

export const AuthedState = () => {
  const { user, nfts, setNFTs, fcl } = useAppProvider();
  const [name, setName] = useState(''); // NEW
  // const [nfts, setNFTs] = useState([]); // NEW
  const [selectedNFTs, setSelectedNFTs] = useState([]);
  console.log(nfts);
  // min super NFTs
  const mintSuperNFT = async () => {
    const transactionId = await fcl.mutate({
      cadence: cadence.cadenceTransactionMintSuperNFT,
      args: (arg, t) => [arg(selectedNFTs, t.Array(t.UInt64))],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });

    const transaction = await fcl.tx(transactionId).onceSealed();
    console.log(transaction);

    const nfts = await fcl.query({
      cadence: cadence.cadenceScriptRetrieveNFTs,
      args: (arg, t) => [arg(user.addr, t.Address)],
    });

    setNFTs(nfts);
  };

  const handleSelectedNFTChange = async (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedNFTs((prevState) => [...prevState, value]);
    } else {
      setSelectedNFTs((prevState) => prevState.filter((n) => n !== value));
    }
  };

  return (
    <>
      {/* <Box bg="gray.600">
        {/* <Button onClick={initAccount}>Init Account</Button>
        <Button onClick={initAndMint}>Mint NFT</Button>
        <Button onClick={sendQuery}>Send Query</Button>
        <Button onClick={retrieveNFTs}>Get NFTs</Button> NEW
        <Button onClick={mintSuperNFT}>Mint SUPER NFT</Button>
        <Button onClick={fcl.unauthenticate}>Log Out</Button>
        <Text>Address: {user?.addr ?? 'No Address'}</Text>
      </Box> */}
      <Button onClick={mintSuperNFT}>Mint SUPER NFT</Button>
      <Grid
        templateColumns={['auto', 'auto', '1fr 1fr', 'repeat(3, 302px)']}
        gap={'16px'}
      >
        {nfts.map((nft) => (
          <Nft key={nft.id + nft.name + 'upper'} nft={nft} />
        ))}
      </Grid>
    </>
  );
};
