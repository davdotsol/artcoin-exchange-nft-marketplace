import { useHooks } from '@providers/web3';

export const useAccount = () => {
  const { useAccount } = useHooks();
  const account = useAccount();
  return { account };
};

export const useNetwork = () => {
  const { useNetwork } = useHooks();
  const network = useNetwork();
  return { network };
};

export const useListedNFTs = () => {
  const { useListedNFTs } = useHooks();
  const nfts = useListedNFTs();
  return { nfts };
};

export const useOwnedNFTs = () => {
  const { useOwnedNFTs } = useHooks();
  const nfts = useOwnedNFTs();
  return { nfts };
};
