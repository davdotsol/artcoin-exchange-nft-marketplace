import NFTItem from '../item';
import { useListedNFTs } from '@hooks/web3';
import { nft } from '../../../../types/nft';

type NFTListProps = {
  nfts: nft[];
};

const NFTList = () => {
  const { nfts } = useListedNFTs();
  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      {nfts.data
        ?.filter((nft) => nft.isListed)
        .map((nft) => (
          <div
            key={nft.meta.image}
            className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-light"
          >
            <NFTItem nft={nft} buyNFT={nfts.buyNFT} />
          </div>
        ))}
    </div>
  );
};

export default NFTList;
