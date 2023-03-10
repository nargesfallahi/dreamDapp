import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useAppProvider } from './app-provider';
import * as cadence from './cadence/cadence';
import { Modal } from './modal';
import { Nft } from './nft';
import { SuperNFT } from './super-nft';

export const AuthedState = () => {
  const { user, nfts, superNfts, nonSuper, setNFTs, fcl } = useAppProvider();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const toggleHasError = useCallback(() => setHasError((s) => !s), []);

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

  const clearInputs = useCallback(() => {
    setName('');
    setDescription('');
    setThumbnail('');
  }, []);

  // mint super NFTs
  const mintSuperNFT = useCallback(async () => {
    setLoading(true);
    try {
      const transactionId = await fcl.mutate({
        cadence: cadence.cadenceTransactionMintSuperNFT,
        args: (arg: any, t: any) => [
          arg(user?.addr, t.Address),
          arg(selectedNFTs, t.Array(t.UInt64)),
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

      setNFTs(nfts);
      setLoading(false);
      setSelectedNFTs([]);
      clearInputs();
      setIsModalOpen(false);
    } catch (e) {
      setHasError(true);
      setLoading(false);
      setIsModalOpen(false);
      setSelectedNFTs([]);
      clearInputs();
      console.log(e);
    }
  }, [
    fcl,
    selectedNFTs,
    setNFTs,
    user,
    name,
    description,
    thumbnail,
    clearInputs,
  ]);

  const handleSelectedNFTChange = useCallback((e: any) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedNFTs((prevState) => [...prevState, value]);
    } else {
      setSelectedNFTs((prevState) => prevState.filter((n) => n !== value));
    }
  }, []);

  return (
    <>
      <Modal
        isOpen={hasError}
        onClose={toggleHasError}
        title="Error completing request"
      >
        <Box>
          <Text>This NFT combination already exists</Text>
        </Box>
      </Modal>
      <Modal
        isOpen={isModalOpen}
        onClose={toggleModalState}
        onSubmit={mintSuperNFT}
        title={'Make your NFT collection'}
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
              placeholder="https://image.com"
              onChange={handleThumbnailChange}
            />
          </Box>
        )}
      </Modal>
      <Tabs>
        <TabList mb={6}>
          <Tab>All NFTs</Tab>
          <Tab>Super NFTs</Tab>
          <Tab>Regular NFTs</Tab>
          <Flex flex="1" justifyContent={'flex-end'}>
            <Button
              colorScheme="blue"
              justifySelf={'flex-end'}
              disabled={selectedNFTs.length < 2}
              onClick={toggleModalState}
              borderBottomRightRadius={'0px'}
              borderBottomLeftRadius={'0px'}
            >
              Mint Collection NFT
            </Button>
          </Flex>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Grid
              templateColumns={['auto', 'auto', '1fr 1fr', 'repeat(3, 302px)']}
              gap={'16px'}
            >
              {nfts.map((nft) =>
                nft.metadata.type === 'RegularNFT' ? (
                  <Nft
                    key={nft.id + nft.name + 'upper'}
                    nft={nft}
                    selectNft={handleSelectedNFTChange}
                    isChecked={selectedNFTs.includes(nft.id)}
                  />
                ) : (
                  <SuperNFT key={nft.id + nft.name + 'upper'} nft={nft} />
                ),
              )}
            </Grid>
          </TabPanel>
          <TabPanel>
            <Grid
              templateColumns={['auto', 'auto', '1fr 1fr', 'repeat(3, 302px)']}
              gap={'16px'}
            >
              {superNfts.map((nft) => (
                <SuperNFT key={nft.id + nft.name + 'upper'} nft={nft} />
              ))}
            </Grid>
          </TabPanel>
          <TabPanel>
            <Grid
              templateColumns={['auto', 'auto', '1fr 1fr', 'repeat(3, 302px)']}
              gap={'16px'}
            >
              {nonSuper.map((nft) => (
                <Nft
                  key={nft.id + nft.name + 'upper'}
                  nft={nft}
                  selectNft={handleSelectedNFTChange}
                  isChecked={selectedNFTs.includes(nft.id)}
                />
              ))}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};
