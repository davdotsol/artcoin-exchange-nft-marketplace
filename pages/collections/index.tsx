import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCollectionNFTs } from '@hooks/web3';
import { BaseLayout } from '@ui';
import { nft } from '@_types/nft';

type NFTListProps = {
  nfts: nft[];
};

const CollectionsPage = () => {
  const router = useRouter();
  const { collectionAddress } = router.query;
  console.log('Collection address', collectionAddress);
  const { nfts } = useCollectionNFTs(collectionAddress as string);
  return (
    <BaseLayout>
      <div className="relative bg-primary pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-secondary sm:text-4xl">
              {collectionAddress} Collection
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-accent sm:mt-4">
              Discover NFTs from the {collectionAddress} collection!
            </p>
          </div>
          <div className="mt-10 text-center">
            <h3 className="text-2xl font-bold">Collection Statistics</h3>
            <p>Total Listings: {0}</p>
            <p>Total Sales: {0}</p>
          </div>
          <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
            {nfts.data
              ?.filter((nft: nft) => nft.isListed)
              .map((nft: nft) => (
                <div
                  key={nft.meta.image}
                  className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-light"
                >
                  <>
                    <div className="flex-shrink-0">
                      <img
                        className={`h-full w-full object-cover`}
                        src={nft.meta.image}
                        alt="New NFT"
                      />
                    </div>
                    <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-highlight">
                          {nft.meta.collection}
                        </p>
                        <div className="block mt-2">
                          <p className="text-xl font-semibold text-secondary">
                            {nft.meta.name}
                          </p>
                          <p className="mt-3 mb-3 text-base text-gray-500">
                            {nft.meta.description}
                          </p>
                        </div>
                      </div>
                      <div className="overflow-hidden mb-4">
                        <dl className="-mx-4 -mt-4 flex flex-wrap">
                          <div className="flex flex-col px-4 pt-4">
                            <dt className="order-2 text-sm font-medium text-gray-500">
                              Price
                            </dt>
                            <dd className="order-1 text-xl font-extrabold text-highlight">
                              <div className="flex justify-center items-center">
                                {nft.price}
                                <img
                                  className="h-6"
                                  src="/images/small-eth.webp"
                                  alt="ether icon"
                                />
                              </div>
                            </dd>
                          </div>
                          {nft.meta.attributes.map((attribute) => (
                            <div
                              key={attribute.trait_type}
                              className="flex flex-col px-4 pt-4"
                            >
                              <dt className="order-2 text-sm font-medium text-gray-500">
                                {attribute.trait_type}
                              </dt>
                              <dd className="order-1 text-xl font-extrabold text-highlight">
                                {attribute.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="disabled:bg-light disabled:text-secondary disabled:border-secondary disabled:shadow-none disabled:cursor-not-allowed mr-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-highlight hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                          onClick={() => {
                            nfts.buyNFT(
                              nft.nftContract,
                              nft.tokenId,
                              nft.price
                            );
                          }}
                        >
                          Buy
                        </button>
                        <button
                          type="button"
                          className="disabled:bg-light disabled:text-secondary disabled:border-secondary disabled:shadow-none disabled:cursor-not-allowed inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  </>
                </div>
              ))}
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default CollectionsPage;
