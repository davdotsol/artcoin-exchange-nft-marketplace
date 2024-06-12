import { BaseLayout, NFTList } from '@ui';
import nfts from '../content/meta.json';
import { NFTMetaData } from '@_types/nft';
import { useWeb3 } from '@providers/web3';

export default function Home() {
  const { ethereum, provider, nftContract } = useWeb3();

  return (
    <BaseLayout>
      <div className="relative bg-primary pt-16 pb-20 px-4 sm:px-6 lg:pt-24 lg:pb-28 lg:px-8">
        <div className="absolute inset-0">
          <div className="bg-white h-1/3 sm:h-2/3" />
        </div>
        <div className="relative">
          <div className="text-center">
            <h2 className="text-3xl tracking-tight font-extrabold text-secondary sm:text-4xl">
              Amazing Robots NFTs
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-accent sm:mt-4">
              Mint a NFT to get unlimited ownership forever!
            </p>
          </div>
          <NFTList nfts={nfts as NFTMetaData[]} />
        </div>
      </div>
    </BaseLayout>
  );
}
