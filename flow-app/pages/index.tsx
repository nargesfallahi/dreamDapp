import { Box, Flex, Grid, Text } from '@chakra-ui/react';

import Head from 'next/head';
import { useAppProvider } from '../components/app-provider';
import { AuthedState } from '../components/authed';
import { Header } from '../components/header';
import { UserInfo } from '../components/user-info';
import '../flow/config';

export default function Home() {
  const { user } = useAppProvider();

  const UnauthenticatedState = () => {
    return (
      <div>
        <Text>Log in to mint an nft</Text>
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
          <Box>
            {user?.loggedIn ? <AuthedState /> : <UnauthenticatedState />}
          </Box>
        </Grid>
      </Flex>
    </>
  );
}
