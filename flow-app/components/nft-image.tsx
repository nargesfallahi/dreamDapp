import { Image } from '@chakra-ui/react';
import { NftType } from './app-provider';

type Props = {
  nft: NftType;
};

export const NftImage = ({ nft }: Props) =>
  nft?.thumbnail.endsWith('.mp4') ? (
    <video
      style={{ width: '100%', aspectRatio: '1/1', background: 'black' }}
      controls={false}
    >
      <source src={nft?.thumbnail} type="video/mp4" />
    </video>
  ) : (
    <Image
      w="100%"
      style={{ aspectRatio: '1/1' }}
      src={nft?.thumbnail}
      alt=""
    />
  );
