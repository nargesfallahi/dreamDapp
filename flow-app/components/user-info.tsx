import { Avatar, Box, Button, Flex, Link } from '@chakra-ui/react';
import { useAppProvider } from './app-provider';

export const UserInfo = () => {
  const { user, fcl } = useAppProvider();
  return (
    <Box
      mt="20px"
      h="400px"
      boxShadow={'md'}
      border="1px"
      borderColor={'gray.200'}
      borderRadius={5}
      p={2}
    >
      <Flex flexDir={'column'} alignItems="center" pt={4}>
        {user?.loggedIn ? (
          <>
            <Avatar size="md" name="User Name" />
            <Link
              mt="10px"
              href={`https://testnet.flowscan.org/account/${user.addr}`}
              color="twitter.400"
            >
              {user.addr}
            </Link>
          </>
        ) : (
          <Box>
            <Button onClick={fcl.logIn}>Log In</Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
