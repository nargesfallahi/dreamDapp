import {
  Avatar,
  Box,
  Button,
  chakra,
  Grid,
  Link,
  shouldForwardProp,
  Text,
} from '@chakra-ui/react';
import { isValidMotionProp, motion, Variants } from 'framer-motion';
import { useCallback, useMemo, useState } from 'react';
import { NftType, useAppProvider } from './app-provider';
import { Modal } from './modal';
import { NftImage } from './nft-image';
import { NftImages } from './super-nft-image';

type Props = {
  nft: NftType;
};

const Container = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const SlideBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const slideMotion: Variants = {
  initial: { y: 80, transition: { duration: 0.2 } },
  hover: { y: 0, transition: { duration: 0.2 } },
};

export const SuperNFT = ({ nft }: Props) => {
  const { nonSuper } = useAppProvider();
  const intersection = useMemo(() => {
    const intersection = nonSuper
      .map((i) => i.id)
      .filter((item) => (nft.metadata?.childNFTs ?? []).includes(item));
    return intersection.map((j) => nonSuper.find((k) => k.id === j));
  }, [nonSuper, nft]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModalState = useCallback(() => setIsModalOpen((s) => !s), []);

  return (
    <Container
      borderRadius={5}
      overflow="hidden"
      w="302px"
      m={0}
      bg="gray.900"
      _light={{ backgroundColor: 'gray.200' }}
      boxShadow={'lg'}
      maxH="382px"
      pos={'relative'}
      whileHover="hover"
      animate="initial"
    >
      <Box pos="relative">
        {nft.thumbnail && <NftImage nft={nft} />}
        {!nft.thumbnail && (
          <NftImages childNfts={(intersection as NftType[]) ?? []} />
        )}
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
              {nft.metadata.minter}
            </Link>
          </Text>
        </Box>
      </Grid>
      <SlideBox
        variants={slideMotion}
        pos="absolute"
        bottom="0px"
        bg="gray.200"
        left="70px"
        right="0px"
        height="80px"
        p={4}
      >
        <Text>
          <Text as="span" fontWeight={'bold'}>
            {intersection.length}
          </Text>
          &nbsp;
          <Text as="span">NFTs in collection</Text>
        </Text>
        <Button
          color={'twitter.500'}
          variant={'link'}
          onClick={toggleModalState}
        >
          View child nfts
        </Button>
      </SlideBox>
      <Modal isOpen={isModalOpen} onClose={toggleModalState}>
        <Grid templateColumns={'200px 200px'} gap={'6px'}>
          {intersection.map((n) => (
            <Box
              key={n?.id + nft.uuid}
              borderRadius={'5px'}
              overflow="hidden"
              border={'2px'}
              borderColor={'gray.200'}
            >
              <NftImage nft={n as NftType} />
              <Box p={1}>
                <Text fontWeight={'bold'}>
                  {n.name} #{n.id}
                </Text>
                <Text>
                  by{' '}
                  <Link color="twitter.500" fontWeight={'bold'}>
                    Test NFT
                  </Link>
                </Text>
              </Box>
            </Box>
          ))}
        </Grid>
      </Modal>
    </Container>
  );
};
