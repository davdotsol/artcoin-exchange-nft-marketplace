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
