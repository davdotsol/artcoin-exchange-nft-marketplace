import { useCallback, useEffect } from 'react';
import { CryptoHookFactory } from '@_types/hooks';
import { nftItem, nft } from '@_types/nft';
import useSWR from 'swr';
import { ethers } from 'ethers';

type UseCollectionStatisticsResponse = {
  totalListings: number;
  totalSales: number;
};

type CollectionStatisticsHookFactory = CryptoHookFactory<
  any,
  UseCollectionStatisticsResponse
>;

export type UseCollectionStatisticsHook =
  ReturnType<CollectionStatisticsHookFactory>;

export const createCollectionStatisticsHook: CollectionStatisticsHookFactory =
  (deps) => () => {
    const { nftContract, marketplaceContract } = deps;

    const fetcher = async () => {
      return { totalListings: 0, totalSales: 0 };
    };

    const { data, ...swr } = useSWR('web3/useCollectionStatistics', fetcher);

    const responseData = data || { totalListings: 0, totalSales: 0 };

    return {
      ...swr,
      data: responseData,
      ...responseData,
    };
  };
