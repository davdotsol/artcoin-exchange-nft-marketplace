import { useEffect } from 'react';
import { CryptoHookFactory } from '@_types/hooks';
import useSWR from 'swr';

type UseListedNFTsResponse = {};

type ListedNFTsHookFactory = CryptoHookFactory<any, UseListedNFTsResponse>;

export type UseListedNFTsHook = ReturnType<ListedNFTsHookFactory>;

export const createListedNFTsHook: ListedNFTsHookFactory = (deps) => () => {
  const { contract } = deps;

  const fetcher = async () => {
    const nfts = [] as any;
    return nfts;
  };

  const { data, ...swr } = useSWR<string>('web3/useListedNFTs', fetcher);

  return {
    ...swr,
    data: data || [],
  };
};
