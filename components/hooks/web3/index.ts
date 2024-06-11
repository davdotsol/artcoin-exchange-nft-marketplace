import { useHooks } from '@providers/web3';

export const useAccount = () => {
  const { useAccount } = useHooks();
  const account = useAccount();
  return { account };
};
