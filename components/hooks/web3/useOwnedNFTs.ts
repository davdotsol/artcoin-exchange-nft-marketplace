import { useEffect } from 'react';
import { CryptoHookFactory } from '@_types/hooks';
import { listing, nft } from '@_types/nft';
import useSWR from 'swr';
import { ethers } from 'ethers';

type UseOwnedNFTsResponse = {};

type OwnedNFTsHookFactory = CryptoHookFactory<any, UseOwnedNFTsResponse>;

export type UseOwnedNFTsHook = ReturnType<OwnedNFTsHookFactory>;

export const createOwnedNFTsHook: OwnedNFTsHookFactory = (deps) => () => {
  const { nftContract, marketplaceContract, provider } = deps;

  const fetcher = async () => {
    const nfts = [] as nft[];
    try {
      const listingCount = await marketplaceContract!.listingCount();
      const signer = await provider.getSigner();
      for (let i = 0; i < listingCount; i++) {
        const tokenURI = await nftContract.tokenURI(i);
        const listing = (await marketplaceContract.getListing(i)) as listing;
        const metaRes = await fetch(tokenURI);
        const meta = await metaRes.json();
        if (listing.seller === signer.address) {
          nfts.push({
            tokenId: parseInt(listing.tokenId.toString()),
            seller: listing.seller,
            price: parseFloat(ethers.formatEther(listing.price)),
            sold: listing.sold,
            meta,
          });
        }
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
