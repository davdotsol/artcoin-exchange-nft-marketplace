import NFTItem from '../item';
import { NFTMetaData } from '../../../types/nft';

type NFTListProps = {
  nfts: NFTMetaData[];
};

const NFTList = ({ nfts }: NFTListProps) => {
  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      {nfts.map((nft) => (
        <div
          key={nft.image}
          className="flex flex-col rounded-lg shadow-lg overflow-hidden"
        >
          <NFTItem nft={nft} />
        </div>
      ))}
    </div>
  );
};

export default NFTList;
