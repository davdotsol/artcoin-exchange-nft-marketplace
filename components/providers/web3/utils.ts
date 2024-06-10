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
