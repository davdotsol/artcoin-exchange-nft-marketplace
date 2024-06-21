import { useCallback, useEffect } from 'react';
import { CryptoHookFactory } from '@_types/hooks';
import { nftItem, nft } from '@_types/nft';
import useSWR from 'swr';
import { ethers } from 'ethers';

type UseOwnedNFTsResponse = {
  listNFT: (tokenId: number, price: number) => Promise<void>;
};

type OwnedNFTsHookFactory = CryptoHookFactory<any, UseOwnedNFTsResponse>;

export type UseOwnedNFTsHook = ReturnType<OwnedNFTsHookFactory>;

export const createOwnedNFTsHook: OwnedNFTsHookFactory = (deps) => () => {
  const { nftContract, marketplaceContract, provider } = deps;

  const fetcher = async () => {
    const nfts = [] as nft[];
    try {
      const signer = await provider?.getSigner();
      const ownedNFTs = await marketplaceContract?.getOwnedNFTs(
        signer?.address
      );
      for (let i = 0; i < ownedNFTs.length; i++) {
        const tokenId = ownedNFTs[i];
        const tokenURI = await nftContract?.tokenURI(tokenId);
        const nftItem = (await marketplaceContract?.getNFTItem(
          tokenId
        )) as nftItem;
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

  const listNFT = useCallback(
    async (tokenId: number, value: number) => {
      try {
        await nftContract?.approve(marketplaceContract?.target, tokenId);
        const tx = await marketplaceContract?.listNFT(
          tokenId,
          ethers.parseEther(value.toString())
        );

        await tx.wait();
      } catch (error) {
        console.log(error);
      }
    },
    [marketplaceContract]
  );

  return {
    ...swr,
    listNFT,
    data: data || [],
  };
};
