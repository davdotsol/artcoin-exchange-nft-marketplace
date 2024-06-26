import { ChangeEvent, useState } from 'react';
import { Switch } from '@headlessui/react';
import axios from 'axios';
import { BaseLayout } from '@ui';
import { NFTMetaData, Trait } from '@_types/nft';
import { useWeb3 } from '@providers/web3';
import { useNetwork } from '@hooks/web3';

const ATTRIBUTES: Trait[] = ['health', 'attack', 'speed'];

const ALLOWED_FIELDS = ['name', 'description', 'image', 'attributes'];

const CreatePage = () => {
  const { provider, nftContract, marketplaceContract } = useWeb3();
  const { network } = useNetwork();
  const [nftURI, setNftURI] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [hasURI, setHasURI] = useState<boolean>(false);
  const [nftMeta, setNFTMeta] = useState<NFTMetaData>({
    name: '',
    description: '',
    image: '',
    attributes: ATTRIBUTES.map((attr) => ({ trait_type: attr, value: '0' })),
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNFTMeta({ ...nftMeta, [name]: value });
  };

  const handleAttributeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNFTMeta((prevMeta) => ({
      ...prevMeta,
      attributes: prevMeta.attributes.map((attr) =>
        attr.trait_type === name ? { ...attr, value } : attr
      ),
    }));
  };

  const createNFT = async () => {
    try {
      const nftRes = await axios.get(nftURI);
      const content = nftRes.data;

      // Validate content fields
      Object.keys(content).forEach((key) => {
        if (!ALLOWED_FIELDS.includes(key)) {
          throw new Error('Invalid JSON structure');
        }
      });

      const signer = await provider?.getSigner();
      await nftContract?.mint(signer?.address, nftURI);
      await marketplaceContract?.addOwnedNFT(nftContract?.target);

      console.log('NFT created and added to marketplace successfully');
    } catch (error) {
      console.error('Error creating NFT:', error);
    }
  };

  if (!network.isConnectedToNetwork) {
    return (
      <BaseLayout>
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
      </BaseLayout>
    );
  }
  return (
    <BaseLayout>
      <div>
        <div className="py-4">
          {!nftURI && (
            <div className="flex">
              <div className="mr-2 font-bold underline">
                Do you have meta data already?
              </div>
              <Switch
                checked={hasURI}
                onChange={() => setHasURI(!hasURI)}
                className={`${
                  hasURI ? 'bg-highlight' : 'bg-accent'
                } relative inline-flex flex-shrink-0 h-[28px] w-[64px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${
                    hasURI ? 'translate-x-9' : 'translate-x-0'
                  } pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
                />
              </Switch>
            </div>
          )}
        </div>
        {nftURI || hasURI ? (
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  List NFT
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  {hasURI && (
                    <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                      <div>
                        <label
                          htmlFor="uri"
                          className="block text-sm font-medium text-gray-700"
                        >
                          URI Link
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            onChange={(e) => setNftURI(e.target.value)}
                            type="text"
                            name="uri"
                            id="uri"
                            className="focus:ring-highlight focus:border-highlight flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="http://link.com/data.json"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  {nftURI && (
                    <div className="mb-4 p-4">
                      <div className="font-bold">Your metadata: </div>
                      <div>
                        <a
                          href={nftURI}
                          className="underline text-highlight"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {nftURI}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price (ETH)
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          value={price}
                          onChange={(e) => setPrice(parseInt(e.target.value))}
                          type="number"
                          name="price"
                          id="price"
                          className="focus:ring-highlight focus:border-highlight flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="0.8"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={createNFT}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-highlight hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight"
                    >
                      List
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Create NFT Metadata
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <input
                          onChange={handleChange}
                          value={nftMeta.name}
                          type="text"
                          name="name"
                          id="name"
                          className="focus:ring-highlight focus:border-highlight flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                          placeholder="My Nice NFT"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          onChange={handleChange}
                          value={nftMeta.description}
                          id="description"
                          name="description"
                          rows={3}
                          className="shadow-sm focus:ring-highlight focus:border-highlight mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Some nft description..."
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Brief description of NFT
                      </p>
                    </div>
                    {/* Has Image? */}
                    {false ? (
                      <img
                        src="https://robohash.org/Robot_1.png"
                        alt=""
                        className="h-40"
                      />
                    ) : (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Cover photo
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <svg
                              className="mx-auto h-12 w-12 text-gray-400"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                              aria-hidden="true"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-highlight hover:text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-highlight"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  className="sr-only"
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-6 gap-6">
                      {nftMeta.attributes.map((attribute) => (
                        <div
                          key={attribute.trait_type}
                          className="col-span-6 sm:col-span-6 lg:col-span-2"
                        >
                          <label
                            htmlFor={attribute.trait_type}
                            className="block text-sm font-medium text-gray-700"
                          >
                            {attribute.trait_type}
                          </label>
                          <input
                            onChange={handleAttributeChange}
                            value={attribute.value}
                            type="text"
                            name={attribute.trait_type}
                            id={attribute.trait_type}
                            className="mt-1 focus:ring-highlight focus:border-highlight block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm !mt-2 text-gray-500">
                      Choose value from 0 to 100
                    </p>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      onClick={() => {}}
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-highlight hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-highlight"
                    >
                      List
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default CreatePage;
