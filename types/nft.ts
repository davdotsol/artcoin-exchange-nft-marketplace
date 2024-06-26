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

export type FileReq = {
  bytes: Uint8Array;
  contentType: string;
  fileName: string;
};

export type PinataRes = {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate: boolean;
};
