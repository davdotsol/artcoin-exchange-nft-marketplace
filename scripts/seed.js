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

  const nftItem = await hre.ethers.getContractAt(
    'NFTMarket',
    config[chainIdStr].NFTMarket.address
  );
  console.log(`NFT token fetched ${nftItem.target}`);

  const nftMarketplace = await hre.ethers.getContractAt(
    'NFTMarketplace',
    config[chainIdStr].NFTMarketplace.address
  );
  console.log(`NFT Marketplace fetched ${nftMarketplace.target}`);

  console.log('Mint NFTs');
  await nftItem.connect(deployer).mint(investor1);
  await nftItem.connect(deployer).mint(investor1);
  await nftItem.connect(deployer).mint(investor2);

  // Approve the marketplace contract to handle the token
  await nftItem.connect(investor1).approve(nftMarketplace, 0);
  await nftItem.connect(investor1).approve(nftMarketplace, 1);
  await nftItem.connect(investor2).approve(nftMarketplace, 2);

  console.log('List NFTs');
  await nftMarketplace.connect(investor1).listNFT(0, ethers.parseEther('0.05'));
  await nftMarketplace.connect(investor1).listNFT(1, ethers.parseEther('0.05'));
  await nftMarketplace.connect(investor2).listNFT(2, ethers.parseEther('0.05'));

  console.log(`Finished.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
