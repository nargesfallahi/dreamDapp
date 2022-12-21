import { Box, Button, Flex, Heading } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useAppProvider } from './app-provider';
import * as cadence from './cadence/cadence';

export const Header = () => {
  const { fcl, user, setNFTs } = useAppProvider();

  const initAccount = useCallback(async () => {
    const transactionId = await fcl.mutate({
      cadence: cadence.cadenceTransactionInitAccount,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });

    const transaction = await fcl.tx(transactionId).onceSealed();
    console.log(transaction);
  }, [fcl]);

  const mintNFT = useCallback(async () => {
    const transactionId = await fcl.mutate({
      cadence: cadence.cadenceTransactionMintNFT,
      args: (arg, t) => [
        arg(user?.addr, t.Address),
        arg('random name', t.String),
        arg('random description', t.String),
        arg(
          'https://assets.nbatopshot.com/editions/5_video_game_numbers_rare/054d38ac-10fb-492c-a47f-54fd1479b247/play_054d38ac-10fb-492c-a47f-54fd1479b247_5_video_game_numbers_rare_capture_Animated_1080_1920_Black.mp4',
          t.String,
        ),
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 999,
    });

    const transaction = await fcl.tx(transactionId).onceSealed();
    console.log(transaction);

    const nfts = await fcl.query({
      cadence: cadence.cadenceScriptRetrieveNFTs,
      args: (arg, t) => [arg(user?.addr, t.Address)],
    });

    setNFTs(nfts);
  }, [user, setNFTs, fcl]);

  const initAndMint = useCallback(async () => {
    await initAccount();
    await mintNFT();
  }, [initAccount, mintNFT]);

  return (
    <header>
      <Flex p="2" justifyContent="space-between" bg="gray.600">
        <Heading>Flow App</Heading>
        <Box>
          <Button mr="3" variant="link" onClick={initAndMint}>
            Mint NFT
          </Button>
          <Button variant="link" onClick={fcl.unauthenticate}>
            Log Out
          </Button>
        </Box>
      </Flex>
    </header>
  );
};
