import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useAppProvider } from './app-provider';
import * as cadence from './cadence/cadence';
import { Modal } from './modal';

export const Header = () => {
  const { fcl, user, setNFTs } = useAppProvider();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const clearInputs = useCallback(() => {
    setName('');
    setDescription('');
    setThumbnail('');
  }, []);

  const toggleModalState = useCallback(() => setIsModalOpen((s) => !s), []);

  const handleNameChange = useCallback((e: any) => setName(e.target.value), []);
  const handleDescriptionChange = useCallback(
    (e: any) => setDescription(e.target.value),
    [],
  );

  const handleThumbnailChange = useCallback(
    (e: any) => setThumbnail(e.target.value),
    [],
  );

  const initAccount = useCallback(async () => {
    try {
      const transactionId = await fcl.mutate({
        cadence: cadence.cadenceTransactionInitAccount,
        payer: fcl.authz,
        proposer: fcl.authz,
        authorizations: [fcl.authz],
        limit: 999,
      });

      const transaction = await fcl.tx(transactionId).onceSealed();
      console.log(transaction);
    } catch (e) {
      console.log(e);
    }
  }, [fcl]);

  const mintNFT = useCallback(async () => {
    setLoading(true);
    try {
      const transactionId = await fcl.mutate({
        cadence: cadence.cadenceTransactionMintNFT,
        args: (arg: any, t: any) => [
          arg(user?.addr, t.Address),
          arg(name, t.String),
          arg(description, t.String),
          arg(thumbnail, t.String),
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
        args: (arg: any, t: any) => [arg(user?.addr, t.Address)],
      });
      clearInputs();
      setLoading(false);
      setNFTs(nfts);
      setIsModalOpen(false);
    } catch (e) {
      setLoading(false);
      clearInputs();
      setIsModalOpen(false);
      console.log(e);
    }
  }, [user, setNFTs, fcl, name, description, thumbnail, clearInputs]);

  const initAndMint = useCallback(async () => {
    await initAccount();
    await mintNFT();
  }, [initAccount, mintNFT]);

  return (
    <header>
      <Flex
        p="2"
        justifyContent="space-between"
        bg="gray.600"
        _light={{ backgroundColor: 'gray.200' }}
        mb={'32px'}
      >
        <Heading>Flow App</Heading>
        <Box>
          <Button mr="3" variant="link" onClick={toggleModalState}>
            Mint NFT
          </Button>
          <Button variant="link" onClick={fcl.unauthenticate}>
            Log Out
          </Button>
        </Box>
      </Flex>
      <Modal
        isOpen={isModalOpen}
        onClose={toggleModalState}
        onSubmit={initAndMint}
      >
        {loading ? (
          <Grid placeItems={'center'}>
            <Spinner />
          </Grid>
        ) : (
          <Box>
            <label>Name</label>
            <Input
              id="name"
              variant={'outline'}
              placeholder="My super NFT"
              mb="3"
              onChange={handleNameChange}
            />
            <label>Description</label>
            <Input
              id="description"
              variant={'outline'}
              placeholder="The best super NFT"
              onChange={handleDescriptionChange}
              mb="3"
            />
            <label>Thumbnail (Optional)</label>
            <Input
              id="thumbnail"
              variant={'outline'}
              placeholder="The best super NFT"
              onChange={handleThumbnailChange}
            />
          </Box>
        )}
      </Modal>
    </header>
  );
};
