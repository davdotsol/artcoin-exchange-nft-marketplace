import { useEffect } from 'react';
import { CryptoHookFactory } from '@_types/hooks';
import { listing, nft } from '@_types/nft';
import useSWR from 'swr';
import { ethers } from 'ethers';

type UseListedNFTsResponse = {};

type ListedNFTsHookFactory = CryptoHookFactory<any, UseListedNFTsResponse>;

export type UseListedNFTsHook = ReturnType<ListedNFTsHookFactory>;

export const createListedNFTsHook: ListedNFTsHookFactory = (deps) => () => {
  const { marketplaceContract } = deps;

  const fetcher = async () => {
    const nfts = [] as nft[];
    try {
      const listingCount = await marketplaceContract!.listingCount();
      for (let i = 0; i < listingCount; i++) {
        const listing = (await marketplaceContract.getListing(i)) as listing;
        const metaRes = await fetch(
          'https://lavender-labour-wasp-844.mypinata.cloud/ipfs/QmeDLUciZ2mtRz4kkhUhQ22nbViAXf5uWmq3eNEksQhjNZ'
        );
        const meta = await metaRes.json();
        console.log('meta', meta);
        nfts.push({
          tokenId: parseInt(listing.tokenId.toString()),
          seller: listing.seller,
          price: parseFloat(ethers.formatEther(listing.price)),
          sold: listing.sold,
          meta,
        });
      }
    } catch (error) {
      console.log(error);
    }
    console.log('NFT', nfts[0]);
    return nfts;
  };

  const { data, ...swr } = useSWR<string>('web3/useListedNFTs', fetcher);

  return {
    ...swr,
    data: data || [],
  };
};
