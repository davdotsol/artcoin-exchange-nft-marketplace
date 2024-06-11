import { MetaMaskInpageProvider } from '@metamask/providers';
import { Contract, BrowserProvider } from 'ethers';
import { Web3Hooks, setupHooks } from '@hooks/web3/setupHooks';
import { Web3Dependencies } from '@_types/hooks';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Web3State = {
  isLoading: boolean; // true while loading web3 state
  hooks: Web3Hooks;
} & Nullable<Web3Dependencies>;

export const getDefaultWeb3State = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks({ isLoading: true } as any),
  };
};

export const getWeb3State = ({
  ethereum,
  provider,
  contract,
  isLoading,
}: Web3Dependencies) => {
  return {
    ethereum,
    provider,
    contract,
    isLoading,
    hooks: setupHooks({ ethereum, provider, contract, isLoading }),
  };
};

export const loadContract = async (name: string, provider: BrowserProvider) => {
  const { chainId } = await provider.getNetwork();
  const res = await fetch(`/config/config.json`);
  const config = await res.json();

  if (!chainId || !config[chainId]) {
    return null;
  }
  const abiRes = await fetch(`/abis/${name}.json`);
  const abi = await abiRes.json();
  const contract = new Contract(config[chainId].market.address, abi, provider);
  return contract;
};
