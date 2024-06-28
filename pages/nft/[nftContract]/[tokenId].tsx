import { useRouter } from 'next/router';
import NFT from '../../../components/NFT'; // Adjust the import path as necessary

const NFTPage = () => {
  const router = useRouter();
  const { nftContract, tokenId } = router.query as {
    nftContract: string;
    tokenId: string;
  };

  // Ensure that the component only renders after the nftContract and tokenId are available
  if (!nftContract || !tokenId) return null;

  return <NFT nftContract={nftContract} tokenId={tokenId} />;
};

export default NFTPage;
