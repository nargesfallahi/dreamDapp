import { Avatar, Box, Grid, Link, Text } from '@chakra-ui/react';
import { NftType } from './app-provider';
import { NftImages } from './super-nft-image';

type Props = {
  nft: NftType;
};

export const SuperNFT = ({ nft }: Props) => {
  return (
    <Box
      borderRadius={5}
      overflow="hidden"
      w="302px"
      m={0}
      bg="gray.900"
      _light={{ backgroundColor: 'white' }}
      boxShadow={'lg'}
      maxH="382px"
      pos={'relative'}
    >
      <Box pos="relative">
        <NftImages childNfts={nft.metadata.childNFTs ?? []} />
      </Box>
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
  );
};
