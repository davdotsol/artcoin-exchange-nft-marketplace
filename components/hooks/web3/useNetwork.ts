import { useEffect } from 'react';
import { CryptoHookFactory } from '@_types/hooks';
import useSWR from 'swr';

const NETWORKS: { [k: string]: string } = {
  1: 'Ethereum Main Network',
  3: 'Ropsten Test Network',
  4: 'Rinkeby Test Network',
  5: 'Goerli Test Network',
  42: 'Kovan Test Network',
  56: 'Binance Smart Chain',
  11155111: 'Sepolia Test Network',
  1337: 'Ganache',
  31337: 'Hardhat',
};

const targetId = process.env.NEXT_PUBLIC_TARGET_CHAIN_ID as string;
const targetNetwork = NETWORKS[targetId];

type UseNetworkResponse = {
  isLoading: boolean;
  isSupported: boolean;
  targetNetwork: string;
};

type NetworkHookFactory = CryptoHookFactory<string, UseNetworkResponse>;

export type UseAccountHook = ReturnType<NetworkHookFactory>;

export const createNetworkHook: NetworkHookFactory = (deps) => () => {
  const { provider, isLoading } = deps;

  const fetcher = async () => {
    if (!provider) {
      throw new Error('Provider is not defined');
    }
    const { chainId } = await provider.getNetwork();
    if (!chainId) {
      throw new Error('Cannot retrieve Network');
    }
    return NETWORKS[chainId];
  };

  const { data, isValidating, ...swrRes } = useSWR<string>(
    'web3/useNetwork',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    ...swrRes,
    data,
    isValidating,
    targetNetwork,
    isSupported: data === targetNetwork,
    isLoading: isLoading as boolean,
  };
};
