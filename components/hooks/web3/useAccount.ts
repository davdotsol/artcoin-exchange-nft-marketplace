import { CryptoHookFactory } from '@_types/hooks';
import useSWR from 'swr';

type AccountHookFactory = CryptoHookFactory<string>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

export const createAccountHook: AccountHookFactory = (deps) => () => {
  const { provider } = deps;

  const fetcher = async () => {
    if (!provider) {
      throw new Error('Provider is not defined');
    }
    const accounts = await provider.listAccounts();
    return accounts[0] || null;
  };

  const swrRes = useSWR('web3/useAccount', fetcher);

  return swrRes;
};
