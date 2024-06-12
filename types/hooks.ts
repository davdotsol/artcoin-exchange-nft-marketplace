import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { SWRResponse } from 'swr';

export type Web3Dependencies = {
  provider: ethers.BrowserProvider;
  nftContract: ethers.Contract;
  ethereum: MetaMaskInpageProvider;
  isLoading: boolean;
};

export type CryptoHandlerHook<D = any, R = any, P = any> = (
  params?: P
) => SWRResponse<D> & R;

export type CryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<Web3Dependencies>): CryptoHandlerHook<D, R, P>;
};
