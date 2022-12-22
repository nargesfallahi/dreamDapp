import {
  Avatar,
  Box,
  chakra,
  Checkbox,
  Grid,
  Image,
  Link,
  shouldForwardProp,
  Text,
} from '@chakra-ui/react';
import { isValidMotionProp, motion, Variants } from 'framer-motion';
import { useCallback, useState } from 'react';
import { NftType } from './app-provider';

type Props = {
  nft: NftType;
  selectNft: (e: any) => void;
  isChecked: boolean;
};

const Container = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const SlideBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const AnimatedImageBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const slideMotion: Variants = {
  rest: { opacity: 0, y: -90, top: 0, transition: { ease: 'easeIn' } },
  hover: {
    opacity: 1,
    y: 0,
    top: 0,
    transition: {
      ease: 'easeIn',
    },
  },
};

const imageMotion: Variants = {
  rest: { opacity: 0, transition: { ease: 'easeIn' } },
  hover: {
    opacity: 1,
    transition: { ease: 'easeIn' },
  },
};

export const Nft = ({ nft, selectNft, isChecked }: Props) => {
  const [isHovered, setIsHovered] = useState(true);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <Container
      borderRadius={5}
      overflow="hidden"
      w="302px"
      m={0}
      bg="gray.900"
      _light={{ backgroundColor: 'white' }}
      boxShadow={'lg'}
      maxH="382px"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      pos={'relative'}
      whileHover="hover"
      animate="rest"
    >
      <Box pos="relative">
        {nft.thumbnail.endsWith('.mp4') ? (
          <video
            style={{ width: '302px', height: '302px', background: 'black' }}
            controls={false}
          >
            <source src={nft.thumbnail} type="video/mp4" />
          </video>
        ) : (
          <Box pos="relative">
            <Image w="302px" maxH={302} h={302} src={nft.thumbnail} alt="" />
            <AnimatedImageBox top="0px" pos="absolute" variants={imageMotion}>
              <Image
                w="302px"
                maxH={302}
                h={302}
                filter="grayscale(.6)"
                src={nft.thumbnail}
                alt=""
              />
            </AnimatedImageBox>
          </Box>
        )}
        <SlideBox
          pos="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          variants={slideMotion}
        >
          <Box
            pos="absolute"
            top={'0px'}
            left={'0px'}
            right={'0px'}
            h={'90px'}
            bgGradient="linear(to-b, rgba(255,255,255,.6), transparent)"
          />
          <Box pos="absolute" top={'12px'} left={'12px'}>
            <Checkbox
              onChange={selectNft}
              value={nft.id}
              isChecked={isChecked}
            />
          </Box>
        </SlideBox>
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
    </Container>
  );
};
