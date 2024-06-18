import NFTItem from '../item';
import { nft } from '../../../../types/nft';

type NFTListProps = {
  nfts: nft[];
};

const NFTList = ({ nfts }: NFTListProps) => {
  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      {nfts.map((nft) => (
        <div
          key={nft.meta.image}
          className="flex flex-col rounded-lg shadow-lg overflow-hidden bg-light"
        >
          <NFTItem nft={nft} />
        </div>
      ))}
    </div>
  );
};

export default NFTList;
