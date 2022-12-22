import { Flex, Grid, GridItem, Image } from '@chakra-ui/react';
import { NftType } from './app-provider';
import { NftImage } from './nft-image';

export const NftImages = ({ childNfts = [] }: { childNfts: NftType[] }) => {
  if (childNfts.length <= 3) {
    return childNfts[0]?.thumbnail.endsWith('.mp4') ? (
      <video
        style={{ width: '302px', height: '302px', background: 'black' }}
        controls={false}
      >
        <source src={childNfts[0]?.thumbnail} type="video/mp4" />
      </video>
    ) : (
      <Image
        w="302px"
        maxH={302}
        h={302}
        src={childNfts[0]?.thumbnail}
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
        {childNfts.map((nft, idx) => {
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
          <NftImage nft={childNfts[0]} />
        </GridItem>
        <GridItem area="right-side">
          <Flex flexDir={'column'} gap={'6px'}>
            <NftImage nft={childNfts[1]} />
            <NftImage nft={childNfts[2]} />
          </Flex>
        </GridItem>
        <GridItem area="bottom-left">
          <Grid templateColumns={'repeat(3, 97px)'} gap="6px">
            <NftImage nft={childNfts[3]} />
            <NftImage nft={childNfts[4]} />
            <NftImage nft={childNfts[5]} />
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
        <NftImage nft={childNfts[0]} />
        <NftImage nft={childNfts[1]} />
        <NftImage nft={childNfts[2]} />
        <NftImage nft={childNfts[3]} />
        <NftImage nft={childNfts[4]} />
        <NftImage nft={childNfts[5]} />
        <NftImage nft={childNfts[6]} />
        <NftImage nft={childNfts[7]} />
        <NftImage nft={childNfts[8]} />
      </Grid>
    );
  }

  return null;
};
