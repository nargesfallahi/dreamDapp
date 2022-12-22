import {
  Avatar,
  Box,
  Checkbox,
  Grid,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';
import { NftType } from './app-provider';

type Props = {
  nft: NftType;
  selectNft: (e: any) => void;
  isChecked: boolean;
};

export const Nft = ({ nft, selectNft, isChecked }: Props) => {
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
        maxH="382px"
      >
        <Box pos={'relative'}>
          {nft.thumbnail.endsWith('.mp4') ? (
            <video
              style={{ width: '302px', height: '302px', background: 'black' }}
              controls
            >
              <source src={nft.thumbnail} type="video/mp4" />
            </video>
          ) : (
            <Image w="302px" maxH={302} h={302} src={nft.thumbnail} alt="" />
          )}

          <Box
            pos="absolute"
            top={'0px'}
            left={'0px'}
            right={'0px'}
            h={'90px'}
            bg="alpha"
            bgGradient="linear(to-b, rgba(255,255,255,.6), transparent)"
          />
          <Box pos="absolute" top={'12px'} left={'12px'}>
            <Checkbox
              onChange={selectNft}
              value={nft.id}
              isChecked={isChecked}
            />
          </Box>
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
    </>
  );
};
