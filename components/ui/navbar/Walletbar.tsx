import { Menu } from '@headlessui/react';
import Link from 'next/link';

type WalletbarProps = {
  isLoading: boolean;
  isInstalled: boolean;
  account: string;
  connect: () => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Walletbar = ({
  isInstalled,
  isLoading,
  connect,
  account,
}: WalletbarProps) => {
  if (isLoading) {
    return (
      <div>
        <button
          onClick={() => {}}
          type="button"
          className="ml-4 px-4 py-2 rounded-md text-white bg-accent hover:bg-highlight focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
        >
          Loading ...
        </button>
      </div>
    );
  }

  if (account) {
    return (
      <Menu as="div" className="ml-3 relative">
        <div>
          <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span className="sr-only">Open user menu</span>
            <img
              className="h-8 w-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </Menu.Button>
        </div>
        <Menu.Items className="z-10 origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            {() => (
              <button
                disabled={true}
                className="disabled:text-gray-500 text-xs block px-4 pt-2 text-gray-700"
              >
                {`0x${account.slice(2, 5)}....${account.slice(-4)}`}
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/profile"
                className={classNames(
                  active ? 'bg-gray-100' : '',
                  'block px-4 py-2 text-sm text-gray-700'
                )}
              >
                Profile
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    );
  }

  if (isInstalled) {
    return (
      <div>
        <button
          onClick={connect}
          type="button"
          className="ml-4 px-4 py-2 rounded-md text-white bg-accent hover:bg-highlight focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
        >
          Connect Wallet
        </button>
      </div>
    );
  } else {
    return (
      <div>
        <button
          onClick={() => {
            window.open('https://metamask.io', '_blank');
          }}
          type="button"
          className="ml-4 px-4 py-2 rounded-md text-white bg-accent hover:bg-highlight focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
        >
          No Wallet
        </button>
      </div>
    );
  }
};

export default Walletbar;
