import { CryptoHookFactory } from '@_types/hooks';
import useSWR from 'swr';

type AccountHookFactory = CryptoHookFactory<string, string>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: CryptoHookFactory<string, string> =
  (deps) => (params) => {
    const swrRes = useSWR('web3/useAccount', () => {
      return 'Hello user';
    });

    return swrRes;
  };
