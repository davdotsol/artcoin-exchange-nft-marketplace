import { createContext, useState, useContext, useEffect } from 'react';
import { Contract, ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';
import {
  getDefaultWeb3State,
  getWeb3State,
  Web3State,
  loadContract,
} from './utils';
import { setupHooks } from '@hooks/web3/setupHooks';

const pageReload = () => {
  window.location.reload();
};

const handleAccountChanged = (ethereum: MetaMaskInpageProvider) => async () => {
  const isLocked = !(await ethereum._metamask.isUnlocked());
  if (isLocked) {
    pageReload();
  }
};

const setGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on('chainChanged', pageReload);
  ethereum.on('accountsChanged', handleAccountChanged(ethereum));
};

const removeGlobalListeners = (ethereum: MetaMaskInpageProvider) => {
  ethereum?.removeListener('chainChanged', pageReload);
  ethereum?.removeListener('accountsChanged', handleAccountChanged);
};

const Web3Context = createContext<Web3State>(getDefaultWeb3State());

const Web3Provider = ({ children }: any) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(getDefaultWeb3State());

  useEffect(() => {
    async function initWeb3() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const nftContract = await loadContract('NFTMarket', provider);
        const marketplaceContract = await loadContract(
          'NFTMarketplace',
          provider
        );

        const signer = await provider.getSigner();
        const signedMarketplaceContract = marketplaceContract?.connect(signer);
        const signedNFTContract = nftContract?.connect(signer);

        if (!nftContract || !marketplaceContract) {
          throw new Error('Contract is not loaded');
        }
        setTimeout(() => setGlobalListeners(window.ethereum), 1000);
        setWeb3Api(
          getWeb3State({
            ethereum: window.ethereum,
            provider,
            nftContract: signedNFTContract as unknown as Contract,
            marketplaceContract:
              signedMarketplaceContract as unknown as Contract,
            isLoading: false,
          })
        );
      } catch (error) {
        setWeb3Api((prev) => ({ ...prev, isLoading: false }));
      }
    }

    initWeb3();

    return () => removeGlobalListeners(window.ethereum);
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
