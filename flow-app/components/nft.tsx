import { Avatar, Box, Grid, Image, Link, Text } from '@chakra-ui/react';
import { NftType } from './app-provider';

type Props = {
  nft: NftType;
};

export const Nft = ({ nft }: Props) => {
  return (
    <>
      <Box
        borderRadius={5}
        overflow="hidden"
        w="302px"
        m={0}
        bg="gray.900"
        _light={{ backgroundColor: 'white' }}
        boxShadow={'lg'}
      >
        <Image w="302px" maxH={302} h={302} src={nft.thumbnail} alt="" />
        <Grid templateColumns={'50px 1fr'} gap="4" p={4}>
          <Avatar size="md" name="Test Nft" />
          <Box>
            <Text fontWeight={'bold'}>
              {nft.name} #{nft.id}
            </Text>
            <Text>
              by{' '}
              <Link color="twitter.500" fontWeight={'bold'}>
                Test NFT
              </Link>
            </Text>
          </Box>
        </Grid>
      </Box>
    </>
  );
};
