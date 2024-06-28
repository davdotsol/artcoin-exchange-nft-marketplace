import { useCallback, useEffect } from 'react';
import { CryptoHookFactory } from '@_types/hooks';
import { nftItem, nft } from '@_types/nft';
import useSWR from 'swr';
import { ethers } from 'ethers';

type UseListedNFTsResponse = {
  buyNFT: (
    nftContract: string,
    tokenId: number,
    value: number
  ) => Promise<void>;
};

interface NFTItem {
  nftContract: string;
  tokenId: number;
  seller: string;
  price: number;
  isListed: boolean;
}

type ListedNFTsHookFactory = CryptoHookFactory<any, UseListedNFTsResponse>;

export type UseListedNFTsHook = ReturnType<ListedNFTsHookFactory>;

export const createListedNFTsHook: ListedNFTsHookFactory = (deps) => () => {
  const { nftContract, marketplaceContract } = deps;

  const fetcher = async () => {
    const nfts = [] as nft[];
    try {
      const nftItems =
        (await marketplaceContract?.getAllListedNFTs()) as NFTItem[];
      // console.log(nftItems);
      for (let i = 0; i < nftItems.length; i++) {
        const tokenURI = await nftContract?.tokenURI(
          nftItems[i].tokenId.toString()
        );
        const metaRes = await fetch(tokenURI);
        const meta = await metaRes.json();
        nfts.push({
          nftContract: nftItems[i].nftContract.toString(),
          tokenId: parseInt(nftItems[i].tokenId.toString()),
          seller: nftItems[i].seller,
          price: parseFloat(ethers.formatEther(nftItems[i].price)),
          isListed: nftItems[i].isListed,
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
    async (nftContract: string, tokenId: number, value: number) => {
      try {
        const tx = await marketplaceContract?.buyNFT(nftContract, tokenId, {
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
