import { useEffect } from 'react';
import { CryptoHookFactory } from '@_types/hooks';
import { nftItem, nft } from '@_types/nft';
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
      const nftItemCount = await marketplaceContract?.nftItemCount();
      for (let i = 0; i < nftItemCount; i++) {
        const tokenURI = await nftContract.tokenURI(i);
        const nftItem = (await marketplaceContract.getNFTItem(i)) as nftItem;
        const metaRes = await fetch(tokenURI);
        const meta = await metaRes.json();
        nfts.push({
          tokenId: parseInt(nftItem.tokenId.toString()),
          seller: nftItem.seller,
          price: parseFloat(ethers.formatEther(nftItem.price)),
          isListed: nftItem.isListed,
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
