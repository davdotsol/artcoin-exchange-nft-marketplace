import { Web3Dependencies } from '@_types/hooks';
import { createAccountHook, UseAccountHook } from './useAccount';
import { createNetworkHook, UseNetworkHook } from './useNetwork';

export type Web3Hooks = {
  useAccount: UseAccountHook;
  useNetwork: UseNetworkHook;
};

export const setupHooks = (deps: Web3Dependencies): Web3Hooks => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
  };
};
