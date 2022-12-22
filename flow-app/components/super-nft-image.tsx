import { Flex, Grid, GridItem, Image } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useAppProvider } from './app-provider';
import { NftImage } from './nft-image';

export const NftImages = ({ childNfts = [] }: { childNfts: string[] }) => {
  const { nonSuper } = useAppProvider();
  const intersection = useMemo(() => {
    const intersection = nonSuper
      .map((i) => i.id)
      .filter((item) => childNfts.includes(item));
    return intersection.map((j) => nonSuper.find((k) => k.id === j));
  }, [nonSuper, childNfts]);

  if (childNfts.length <= 3) {
    return intersection[0]?.thumbnail.endsWith('.mp4') ? (
      <video
        style={{ width: '302px', height: '302px', background: 'black' }}
        controls={false}
      >
        <source src={intersection[0]?.thumbnail} type="video/mp4" />
      </video>
    ) : (
      <Image
        w="302px"
        maxH={302}
        h={302}
        src={intersection[0]?.thumbnail}
        alt=""
      />
    );
  }

  if (childNfts.length <= 5) {
    return (
      <Grid
        templateColumns={'1fr 1fr'}
        width={'302px'}
        height={'302px'}
        gap="6px"
      >
        {intersection.map((nft, idx) => {
          return <NftImage key={nft.id + idx} nft={nft} />;
        })}
      </Grid>
    );
  }

  if (childNfts.length < 9) {
    return (
      <Grid
        templateColumns={'200px 97px'}
        gap="6px"
        templateAreas={'200px 97px'}
        width={'302px'}
        height={'302px'}
        gridTemplateAreas={`
          "main right-side"
          "bottom-left middle"
        `}
      >
        <GridItem width="200px" height="200px" area="main">
          <NftImage nft={intersection[0]} />
        </GridItem>
        <GridItem area="right-side">
          <Flex flexDir={'column'} gap={'6px'}>
            <NftImage nft={intersection[1]} />
            <NftImage nft={intersection[2]} />
          </Flex>
        </GridItem>
        <GridItem area="bottom-left">
          <Grid templateColumns={'repeat(3, 97px)'} gap="6px">
            <NftImage nft={intersection[3]} />
            <NftImage nft={intersection[4]} />
            <NftImage nft={intersection[5]} />
          </Grid>
        </GridItem>
      </Grid>
    );
  }

  if (childNfts.length >= 9) {
    return (
      <Grid
        templateColumns={'97px 97px 97px'}
        gap="6px"
        templateAreas={'97px 97px 97px'}
        width={'302px'}
        height={'302px'}
      >
        <NftImage nft={intersection[0]} />
        <NftImage nft={intersection[1]} />
        <NftImage nft={intersection[2]} />
        <NftImage nft={intersection[3]} />
        <NftImage nft={intersection[4]} />
        <NftImage nft={intersection[5]} />
        <NftImage nft={intersection[6]} />
        <NftImage nft={intersection[7]} />
        <NftImage nft={intersection[8]} />
      </Grid>
    );
  }

  return null;
};
