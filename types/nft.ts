export type Trait = 'attack' | 'health' | 'speed';

export type NFTAttribute = {
  trait_type: Trait;
  value: string;
};

export type NFTMetaData = {
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
};

export type nftItem = {
  tokenId: number;
  seller: string;
  price: number;
  isListed: boolean;
};

export type nft = {
  meta: NFTMetaData;
} & nftItem;
