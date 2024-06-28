import { useRouter } from 'next/router';
import { Collection } from '@ui'; // Update the path as necessary

const CollectionPage = () => {
  const router = useRouter();
  const { collectionAddress } = router.query as { collectionAddress: string };
  console.log('collection address', collectionAddress);

  // Ensure that the component only renders after the collectionAddress is available
  if (!collectionAddress) return null;

  return <Collection collectionAddress={collectionAddress} />;
};

export default CollectionPage;
