import { Box, Flex, Grid } from '@chakra-ui/react';
import * as fcl from '@onflow/fcl';
import Head from 'next/head';
import { useAppProvider } from '../components/app-provider';
import { AuthedState } from '../components/authed';
import { Header } from '../components/header';
import { UserInfo } from '../components/user-info';
import '../flow/config';

export default function Home() {
  const { user } = useAppProvider();
  //   const [user, setUser] = useState({ loggedIn: null });
  //   const [name, setName] = useState(''); // NEW
  //   const [nfts, setNFTs] = useState([]); // NEW
  //   const [selectedNFTs, setSelectedNFTs] = useState([]);

  //   useEffect(() => fcl.currentUser.subscribe(setUser), []);

  // NEW
  //   const sendQuery = async () => {
  //     const profile = await fcl.query({
  //       cadence: `
  //         import Profile from 0xProfile

  //         pub fun main(address: Address): Profile.ReadOnly? {
  //           return Profile.read(address)
  //         }
  //       `,
  //       args: (arg, t) => [arg(user.addr, t.Address)],
  //     });

  //     setName(profile?.name ?? 'No Profile');
  //   };

  //   const retrieveNFTs = useCallback(async () => {
  //     const nfts = await fcl.query({
  //       cadence: cadence.cadenceScriptRetrieveNFTs,
  //       args: (arg, t) => [arg(user.addr, t.Address)],
  //     });

  //     setNFTs(nfts ?? 'No NFTs');
  //   }, [user]);

  //   useEffect(() => {
  //     if (user && !nfts) {
  //       (async () => await retrieveNFTs())();
  //     }
  //   }, [retrieveNFTs, user, nfts]);

  // Mint Super NFT -> pop up with thumbnail of existing ones (retrieveNFT) radio button we select -> submit -> mints it

  //   const AuthedState = () => {
  //     return (
  //       <div>
  //         <Box bg="gray.600">
  //           {/* <Button onClick={initAccount}>Init Account</Button> {/* NEW */}
  //           <Button onClick={initAndMint}>Mint NFT</Button>
  //           {/*<Button onClick={sendQuery}>Send Query</Button> */}
  //           {/* NEW */}
  //           <Button onClick={retrieveNFTs}>Get NFTs</Button> {/* NEW */}
  //           <Button onClick={mintSuperNFT}>Mint SUPER NFT</Button>
  //           <Button onClick={fcl.unauthenticate}>Log Out</Button>
  //           <Text>Address: {user?.addr ?? 'No Address'}</Text>
  //         </Box>
  //         <Box>
  //           {nfts.map((nft) => (
  //             <div key={nft.id}>
  //               <h2>NFT Name: {nft.name}</h2>
  //               <h2>NFT Description: {nft.description}</h2>
  //               <h2>NFT ID: {nft.id}</h2>
  //               <input
  //                 type="checkbox"
  //                 id={nft.id}
  //                 value={nft.id}
  //                 name="nftID"
  //                 onChange={handleSelectedNFTChange}
  //                 checked={selectedNFTs.includes(nft.id)}
  //               />{' '}
  //               Select NFT
  //               <img width="100" src={nft.thumbnail} alt="nft image"></img>
  //               {nft.metadata['type'] == 'SuperNFT' ? (
  //                 <h2>
  //                   Child NFTs:{' '}
  //                   {nft.metadata['childNFTs'].map((nftID) =>
  //                     nfts
  //                       .filter((nft) => nft.id == nftID)
  //                       .map((nft) => (
  //                         <h3>
  //                           Child thumbnail:{' '}
  //                           <img
  //                             width="100"
  //                             src={nft.thumbnail}
  //                             alt="nft image"
  //                           ></img>
  //                         </h3>
  //                       )),
  //                   )}
  //                 </h2>
  //               ) : (
  //                 <h2>None</h2>
  //               )}
  //             </div>
  //           ))}
  //           {/* NEW */}
  //         </Box>
  //       </div>
  //     );
  //   };

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>FCL Quickstart with NextJS</title>
        <meta name="description" content="My first web3 app on Flow!" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <Flex
        flexDir={['column', 'row']}
        justifyContent={'center'}
        mx={['10px', '16px']}
      >
        <Grid
          templateColumns={['1fr', '1fr', '1fr', '280px 1fr']}
          gap={['10px', '16px', '32px']}
        >
          <UserInfo />
          <Box m="4">
            {user?.loggedIn ? <AuthedState /> : <UnauthenticatedState />}
          </Box>
        </Grid>
      </Flex>
    </>
  );
}
