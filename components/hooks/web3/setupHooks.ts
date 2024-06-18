import { Web3Dependencies } from '@_types/hooks';
import { createAccountHook, UseAccountHook } from './useAccount';
import { createNetworkHook, UseNetworkHook } from './useNetwork';
import { createListedNFTsHook, UseListedNFTsHook } from './useListedNfts';
import { createOwnedNFTsHook, UseOwnedNFTsHook } from './useOwnedNFTs';

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
  useListedNFTs: UseListedNFTsHook;
  useOwnedNFTs: UseOwnedNFTsHook;
};

export const setupHooks = (deps: Web3Dependencies): Web3Hooks => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
    useListedNFTs: createListedNFTsHook(deps),
    useOwnedNFTs: createOwnedNFTsHook(deps),
  };
};
