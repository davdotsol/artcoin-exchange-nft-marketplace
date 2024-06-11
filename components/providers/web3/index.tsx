import { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  getDefaultWeb3State,
  getWeb3State,
  Web3State,
  loadContract,
} from './utils';
import { setupHooks } from '@hooks/web3/setupHooks';

const Web3Context = createContext<Web3State>(getDefaultWeb3State());

const Web3Provider = ({ children }: any) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(getDefaultWeb3State());

  useEffect(() => {
    async function initWeb3() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const contract = await loadContract('NFTMarket', provider);
        setWeb3Api(
          getWeb3State({
            ethereum: window.ethereum,
            provider,
            contract,
            isLoading: false,
          })
        );
      } catch (error) {
        setWeb3Api((prev) => ({ ...prev, isLoading: false }));
      }
    }

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);

export function useHooks() {
  const { hooks } = useWeb3();
  return hooks;
}

export default Web3Provider;
