import { Box, Button } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import { useState } from 'react';
import { useAppProvider } from './app-provider';
import * as cadence from './cadence/cadence';

export const AuthedState = () => {
  const { user, nfts, setNFTs } = useAppProvider();
  const [name, setName] = useState(''); // NEW
  // const [nfts, setNFTs] = useState([]); // NEW
  const [selectedNFTs, setSelectedNFTs] = useState([]);

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

  // const initAccount = useCallback(async () => {
  //   const transactionId = await fcl.mutate({
  //     cadence: cadence.cadenceTransactionInitAccount,
  //     payer: fcl.authz,
  //     proposer: fcl.authz,
  //     authorizations: [fcl.authz],
  //     limit: 999,
  //   });

  //   const transaction = await fcl.tx(transactionId).onceSealed();
  //   console.log(transaction);
  // }, []);

  // const mintNFT = useCallback(async () => {
  //   const transactionId = await fcl.mutate({
  //     cadence: cadence.cadenceTransactionMintNFT,
  //     args: (arg, t) => [
  //       arg(user?.addr, t.Address),
  //       arg('random name', t.String),
  //       arg('random description', t.String),
  //       arg(
  //         'https://assets.nbatopshot.com/editions/5_video_game_numbers_rare/054d38ac-10fb-492c-a47f-54fd1479b247/play_054d38ac-10fb-492c-a47f-54fd1479b247_5_video_game_numbers_rare_capture_Animated_1080_1920_Black.mp4',
  //         t.String,
  //       ),
  //     ],
  //     payer: fcl.authz,
  //     proposer: fcl.authz,
  //     authorizations: [fcl.authz],
  //     limit: 999,
  //   });

  //   const transaction = await fcl.tx(transactionId).onceSealed();
  //   console.log(transaction);

  //   const nfts = await fcl.query({
  //     cadence: cadence.cadenceScriptRetrieveNFTs,
  //     args: (arg, t) => [arg(user?.addr, t.Address)],
  //   });

  //   setNFTs(nfts);
  // }, [user, setNFTs]);

  // const initAndMint = useCallback(async () => {
  //   await initAccount();
  //   await mintNFT();
  // }, [initAccount, mintNFT]);

  const handleSelectedNFTChange = async (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedNFTs((prevState) => [...prevState, value]);
    } else {
      setSelectedNFTs((prevState) => prevState.filter((n) => n !== value));
    }
  };

  return (
    <div>
      {/* <Box bg="gray.600">
        {/* <Button onClick={initAccount}>Init Account</Button>
        <Button onClick={initAndMint}>Mint NFT</Button>
        <Button onClick={sendQuery}>Send Query</Button>
        <Button onClick={retrieveNFTs}>Get NFTs</Button> NEW
        <Button onClick={mintSuperNFT}>Mint SUPER NFT</Button>
        <Button onClick={fcl.unauthenticate}>Log Out</Button>
        <Text>Address: {user?.addr ?? 'No Address'}</Text>
      </Box> */}
      <Box>
        <Button onClick={mintSuperNFT}>Mint SUPER NFT</Button>
        {nfts.map((nft) => (
          <div key={nft.id}>
            <h2>NFT Name: {nft.name}</h2>
            <h2>NFT Description: {nft.description}</h2>
            <h2>NFT ID: {nft.id}</h2>
            <input
              type="checkbox"
              id={nft.id}
              value={nft.id}
              name="nftID"
              onChange={handleSelectedNFTChange}
              checked={selectedNFTs.includes(nft.id)}
            />{' '}
            Select NFT
            <img width="100" src={nft.thumbnail} alt="nft image"></img>
            {nft.metadata['type'] == 'SuperNFT' ? (
              <h2>
                Child NFTs:{' '}
                {nft.metadata['childNFTs'].map((nftID) =>
                  nfts
                    .filter((nft) => nft.id == nftID)
                    .map((nft, idx) => (
                      <p key={nft.id + idx + 'super'}>
                        Child thumbnail:{' '}
                        <img
                          width="100"
                          src={nft.thumbnail}
                          alt="nft image"
                        ></img>
                      </p>
                    )),
                )}
              </h2>
            ) : (
              <h2>None</h2>
            )}
          </div>
        ))}
        {/* NEW */}
      </Box>
    </div>
  );
};
