import { ethers } from 'ethers';
import { useState } from 'react';
import { BaseLayout } from '@ui';
import { useNFTDetails, usePlaceBid, useBuyNFT } from '@hooks/web3';
import { useWeb3 } from '@providers/web3';

interface Attribute {
  trait_type: string;
  value: string;
}

interface NFTMeta {
  image: string;
  name: string;
  description: string;
  attributes: Attribute[];
}

interface NFTItem {
  nftContract: string;
  tokenId: number;
  price: ethers.BigNumber;
  seller: string;
  isListed: boolean;
  meta: NFTMeta;
}

interface NFTDetailsProps {
  nftContract: string;
  tokenId: string;
}

export default function NFTDetails({ nftContract, tokenId }: NFTDetailsProps) {
  const { nft } = useNFTDetails(nftContract, parseInt(tokenId));
  const { placeBid } = usePlaceBid();
  const { buyNFT } = useBuyNFT();
  const [bidAmount, setBidAmount] = useState<string>('');

  const handlePlaceBid = async (amount: string) => {
    await placeBid(
      nftContract,
      parseInt(tokenId),
      ethers.utils.parseEther(amount)
    );
  };

  const handleBuyNFT = async () => {
    if (nft) {
      await buyNFT(nft.nftContract, nft.tokenId, nft.price);
    }
  };

  if (!nft) {
    return <div>Loading...</div>;
  }

  return (
    <BaseLayout>
      <div className="relative bg-primary pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-secondary sm:text-4xl">
              {nft.meta.name}
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-accent sm:mt-4">
              {nft.meta.description}
            </p>
          </div>
          <div className="mt-10 max-w-lg mx-auto grid gap-5 lg:grid-cols-1 lg:max-w-none">
            <div className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-light">
              <div className="flex-shrink-0">
                <img
                  className={`h-full w-full object-cover`}
                  src={nft.meta.image}
                  alt="NFT"
                />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="block mt-2">
                    <p className="text-xl font-semibold text-secondary">
                      Attributes
                    </p>
                    <div className="mt-3 mb-3 text-base text-gray-500">
                      {nft.meta.attributes.map((attribute) => (
                        <div key={attribute.trait_type} className="flex">
                          <span className="mr-2">{attribute.trait_type}:</span>
                          <span>{attribute.value}</span>
                        </div>
                      ))}
                    </div>
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
                          {ethers.utils.formatEther(nft.price)}
                          <img
                            className="h-6"
                            src="/images/small-eth.webp"
                            alt="ether icon"
                          />
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <button
                    type="button"
                    className="mr-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-highlight hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                    onClick={handleBuyNFT}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h3 className="text-2xl font-bold">Place a Bid</h3>
            <input
              type="text"
              placeholder="Enter bid amount in ETH"
              className="mt-3 p-2 border rounded"
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button
              type="button"
              className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-highlight hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
              onClick={() => handlePlaceBid(bidAmount)}
            >
              Place Bid
            </button>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
