import { MetaMaskInpageProvider } from '@metamask/providers';
import { Contract, BrowserProvider } from 'ethers';

export type Web3Params = {
  ethereum: MetaMaskInpageProvider | null;
  provider: BrowserProvider | null;
  contract: Contract | null;
};

export type Web3State = {
  isLoading: boolean; // true while loading web3 state
} & Web3Params;

export const getDefaultWeb3State = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
  };
};
