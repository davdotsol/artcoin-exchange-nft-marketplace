import { useCallback, useEffect } from 'react';
import { CryptoHookFactory } from '@_types/hooks';
import { nftItem, nft } from '@_types/nft';
import useSWR from 'swr';
import { ethers } from 'ethers';

type UseListedNFTsResponse = {
  buyNFT: (tokenId: number, value: number) => Promise<void>;
};

type ListedNFTsHookFactory = CryptoHookFactory<any, UseListedNFTsResponse>;

export type UseListedNFTsHook = ReturnType<ListedNFTsHookFactory>;

export const createListedNFTsHook: ListedNFTsHookFactory = (deps) => () => {
  const { nftContract, marketplaceContract } = deps;

  const fetcher = async () => {
    const nfts = [] as nft[];
    try {
      const nftItemCount = await marketplaceContract?.nftItemCount();
      for (let i = 0; i < nftItemCount; i++) {
        const tokenURI = await nftContract?.tokenURI(i);
        const tId = await marketplaceContract?.tokenIds(i);
        const nftItem = (await marketplaceContract?.getNFTItem(tId)) as nftItem;
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

  const { data, ...swr } = useSWR('web3/useListedNFTs', fetcher);

  const buyNFT = useCallback(
    async (tokenId: number, value: number) => {
      console.log('buy NFT price', value);
      try {
        const tx = await marketplaceContract?.buyNFT(tokenId, {
          value: ethers.parseEther(value.toString()),
        });

        const result = await tx.wait();
      } catch (error) {
        console.log(error);
      }
    },
    [marketplaceContract]
  );

  return {
    ...swr,
    buyNFT,
    data: data || [],
  };
};
