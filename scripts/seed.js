const hre = require('hardhat');
const config = require('../public/config/config.json');

const tokens = (m) => {
  return ethers.parseUnits(m.toString(), 18);
};

const ether = tokens;
const shares = ether;

async function main() {
  console.log(`Fetching accounts & network\n`);
  const accounts = await hre.ethers.getSigners();

  const deployer = accounts[0];
  const investor1 = accounts[1];
  const investor2 = accounts[2];
  const investor3 = accounts[3];
  const investor4 = accounts[4];

  const { chainId } = await hre.ethers.provider.getNetwork();

  const chainIdStr = chainId.toString(); // Convert bigint to string

  if (!chainId || !config[chainIdStr]) {
    return null;
  }

  const nftContract_1 = await hre.ethers.getContractAt(
    'NFTMarket',
    config[chainIdStr].NFTMarket.address
  );
  console.log(`NFT token fetched ${nftContract_1.target}`);

  const nftMarketplace = await hre.ethers.getContractAt(
    'NFTMarketplace',
    config[chainIdStr].NFTMarketplace.address
  );
  console.log(`NFT Marketplace fetched ${nftMarketplace.target}`);

  console.log('Mint NFTs');
  await nftContract_1
    .connect(deployer)
    .mint(
      investor1,
      'https://lavender-labour-wasp-844.mypinata.cloud/ipfs/QmWRnQWTKrEpV1zCXpqG7saCwhfNJzF1MxE1KTRiiHuBT3'
    );
  await nftContract_1
    .connect(deployer)
    .mint(
      investor1,
      'https://lavender-labour-wasp-844.mypinata.cloud/ipfs/QmUoxgeMJGd3ktujEQ7WmWS7Q71NsLiPvGWHwxK9LWwoGU'
    );
  await nftContract_1
    .connect(deployer)
    .mint(
      investor2,
      'https://lavender-labour-wasp-844.mypinata.cloud/ipfs/QmSTJsTeTC4UGCdT8B7jpHFDtVLbkreex2y4F7mMWBUrAR'
    );

  // Approve the marketplace contract to handle the token
  await nftContract_1.connect(investor1).approve(nftMarketplace, 0);
  await nftContract_1.connect(investor1).approve(nftMarketplace, 1);
  await nftContract_1.connect(investor2).approve(nftMarketplace, 2);

  console.log('List NFTs');
  await nftMarketplace
    .connect(investor1)
    .listNFT(nftContract_1.target, 0, ethers.parseEther('0.05'));
  await nftMarketplace
    .connect(investor1)
    .listNFT(nftContract_1.target, 1, ethers.parseEther('0.05'));
  await nftMarketplace
    .connect(investor2)
    .listNFT(nftContract_1.target, 2, ethers.parseEther('0.05'));

  console.log('Buy NFT');
  await nftMarketplace
    .connect(investor3)
    .buyNFT(nftContract_1.target, 2, { value: ethers.parseEther('0.05') });

  console.log(`Finished.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
