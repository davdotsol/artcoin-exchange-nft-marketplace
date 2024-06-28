import Link from 'next/link';
import { nft } from '@_types/nft';

type NFTItemProps = {
  nft: nft;
  buyNFT: (
    nftContract: string,
    tokenId: number,
    value: number
  ) => Promise<void>;
};

const NFTItem = ({ nft, buyNFT }: NFTItemProps) => {
  console.log(nft);
  return (
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
          <Link
            href={`/collections/${nft.nftContract}`}
            className="text-sm font-medium text-highlight hover:underline"
          >
            {nft.meta.collection}
          </Link>
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
              buyNFT(nft.nftContract, nft.tokenId, nft.price);
            }}
          >
            Buy
          </button>
          <Link
            href={`/nft/${nft.nftContract}/${nft.tokenId}`}
            className="disabled:bg-light disabled:text-secondary disabled:border-secondary disabled:shadow-none disabled:cursor-not-allowed inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            Preview
          </Link>
        </div>
      </div>
    </>
  );
};

export default NFTItem;
