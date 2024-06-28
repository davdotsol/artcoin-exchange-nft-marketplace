import { Web3Dependencies } from '@_types/hooks';
import { createAccountHook, UseAccountHook } from './useAccount';
import { createNetworkHook, UseNetworkHook } from './useNetwork';
import { createListedNFTsHook, UseListedNFTsHook } from './useListedNfts';
import {
  createCollectionStatisticsHook,
  UseCollectionStatisticsHook,
} from './useCollectionStatistics';
import {
  createCollectionNFTsHook,
  UseCollectionNFTsHook,
} from './useCollectionNFTs';
import { createOwnedNFTsHook, UseOwnedNFTsHook } from './useOwnedNFTs';

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useListedNFTs: UseListedNFTsHook;
  useCollectionNFTs: UseCollectionNFTsHook;
  useCollectionStatistics: UseCollectionStatisticsHook;
  useOwnedNFTs: UseOwnedNFTsHook;
};

export const setupHooks = (deps: Web3Dependencies): Web3Hooks => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
    useListedNFTs: createListedNFTsHook(deps),
    useCollectionNFTs: createCollectionNFTsHook(deps),
    useCollectionStatistics: createCollectionStatisticsHook(deps),
    useOwnedNFTs: createOwnedNFTsHook(deps),
  };
};
