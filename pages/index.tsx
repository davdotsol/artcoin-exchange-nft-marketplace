import { BaseLayout, NFTList } from '@ui';
import { NFTMetaData } from '@_types/nft';
import { useNetwork } from '@hooks/web3';
import { useWeb3 } from '@providers/web3';

export default function Home() {
  const { ethereum, provider } = useWeb3();
  const { network } = useNetwork();

  return (
    <BaseLayout>
      <div className="relative bg-primary pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-secondary sm:text-4xl">
              Amazing NFTs Marketplace
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-accent sm:mt-4">
              Explore and trade NFTs from various collections!
            </p>
          </div>
          <div className="mt-10 text-center">
            <h3 className="text-2xl font-bold">Marketplace Statistics</h3>
            <p>Total Listings: {0}</p>
            <p>Total Sales: {0}</p>
          </div>
          {network.isConnectedToNetwork ? (
            <NFTList />
          ) : (
            <div className="rounded-md bg-yellow-50 p-4 mt-10">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Attention needed
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      {network.isLoading
                        ? 'Loading...'
                        : `Connect to ${network.targetNetwork}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}
