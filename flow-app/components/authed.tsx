import {
  Box,
  Button,
  Grid,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
// import * as fcl from '@onflow/fcl';
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
  const [selectedNFTs, setSelectedNFTs] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModalState = useCallback(() => setIsModalOpen((s) => !s), []);

  const handleNameChange = useCallback((e: any) => setName(e.target.value), []);
  const handleDescriptionChange = useCallback(
    (e: any) => setDescription(e.target.value),
    [],
  );

  // mint super NFTs
  const mintSuperNFT = useCallback(async () => {
    const transactionId = await fcl.mutate({
      cadence: cadence.cadenceTransactionMintSuperNFT,
      args: (arg: any, t: any) => [
        arg(selectedNFTs, t.Array(t.UInt64)).arg(name, t.String),
        arg(description, t.String),
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
  }, [fcl, selectedNFTs, setNFTs, user, name, description]);

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
      <Button onClick={toggleModalState}>Mint SUPER NFT</Button>
      <Modal
        isOpen={isModalOpen}
        onClose={toggleModalState}
        onSubmit={mintSuperNFT}
      >
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
          />
        </Box>
      </Modal>
      <Tabs>
        <TabList mb={6}>
          <Tab>All NFTs</Tab>
          <Tab>Super NFTs</Tab>
          <Tab>Regular NFTs</Tab>
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
