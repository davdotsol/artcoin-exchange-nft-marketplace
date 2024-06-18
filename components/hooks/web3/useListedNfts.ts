import { useEffect } from 'react';
import { CryptoHookFactory } from '@_types/hooks';
import { listing, nft } from '@_types/nft';
import useSWR from 'swr';
import { ethers } from 'ethers';

type UseListedNFTsResponse = {};

type ListedNFTsHookFactory = CryptoHookFactory<any, UseListedNFTsResponse>;

export type UseListedNFTsHook = ReturnType<ListedNFTsHookFactory>;

export const createListedNFTsHook: ListedNFTsHookFactory = (deps) => () => {
  const { nftContract, marketplaceContract } = deps;

  const fetcher = async () => {
    const nfts = [] as nft[];
    try {
      const listingCount = await marketplaceContract!.listingCount();
      for (let i = 0; i < listingCount; i++) {
        const tokenURI = await nftContract.tokenURI(i);
        const listing = (await marketplaceContract.getListing(i)) as listing;
        const metaRes = await fetch(tokenURI);
        const meta = await metaRes.json();
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
    return nfts;
  };

  const { data, ...swr } = useSWR<string>('web3/useListedNFTs', fetcher);

  return {
    ...swr,
    data: data || [],
  };
};
