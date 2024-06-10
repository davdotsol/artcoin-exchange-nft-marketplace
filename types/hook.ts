import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SWRResponse } from 'swr';

export type Web3Dependencies = {
  provider: ethers.BrowserProvider;
  contract: ethers.Contract;
  ethereum: MetaMaskInpageProvider;
};

export type CryptoHandlerHook<D = any, P = any> = (params: P) => SWRResponse<D>;

export type CryptoHookFactory<D = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, P>;
};
