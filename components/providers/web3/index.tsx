import { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';
import { getDefaultWeb3State, Web3State } from './utils';

const Web3Context = createContext<Web3State>(getDefaultWeb3State());

const Web3Provider = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(getDefaultWeb3State());

  useEffect(() => {
    async function initWeb3() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        setWeb3Api({
          ethereum: window.ethereum,
          provider: provider,
          contract: null,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error initializing Web3:', error);
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

export default Web3Provider;
