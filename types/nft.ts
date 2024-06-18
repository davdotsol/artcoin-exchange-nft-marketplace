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

export type listing = {
  tokenId: number;
  seller: string;
  price: string;
  sold: boolean;
};

export type nft = {
  meta: NFTMetaData;
} & listing;
