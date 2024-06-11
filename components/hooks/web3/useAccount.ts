import { useEffect } from 'react';
import { CryptoHookFactory } from '@_types/hooks';
import useSWR from 'swr';

type UseAccountResponse = {
  connect: () => void;
  isLoading: boolean;
  isInstalled: boolean;
};

type AccountHookFactory = CryptoHookFactory<string, UseAccountResponse>;

export type UseAccountHook = ReturnType<AccountHookFactory>;

export const createAccountHook: AccountHookFactory = (deps) => () => {
  const { provider, ethereum, isLoading } = deps;

  const fetcher = async () => {
    if (!provider) {
      throw new Error('Provider is not defined');
    }
    const accounts = await provider.listAccounts();
    const account = accounts[0];
    if (!account) {
      throw new Error('Account is not defined');
    }
    return account.address;
  };

  const { data, mutate, isValidating, ...swrRes } = useSWR<string>(
    'web3/useAccount',
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    ethereum?.on('accountsChanged', handleAccountsChanged);
    return () => {
      ethereum?.removeListener('accountsChanged', handleAccountsChanged);
    };
  });

  const handleAccountsChanged = (...args: unknow[]) => {
    const accounts = args[0] as string[];
    console.log(accounts);
    if (accounts.length === 0) {
      console.error('Please, connect to Web3 wallet');
    } else if (accounts[0] !== swrRes.data) {
      swrRes.mutate(accounts[0]);
    }
  };

  const connect = async () => {
    if (!ethereum) {
      throw new Error('Ethereum is not defined');
    }
    try {
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log(error.message);
    }
  };

  return {
    ...swrRes,
    data,
    isValidating,
    isLoading: isLoading || isValidating,
    isInstalled: ethereum?.isMetaMask || false,
    mutate,
    connect,
  };
};
