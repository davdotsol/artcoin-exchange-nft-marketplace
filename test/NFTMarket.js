const { expect } = require('chai');

const {
  loadFixture,
} = require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe('NFTMarket Contract', function () {
  async function deployFixture() {
    // Get the Signers here.
    const [owner, addr1, addr2] = await ethers.getSigners();

    const NFTMarket = await ethers.getContractFactory('NFTMarket');
    const nftMarket = await NFTMarket.deploy(owner);

    await nftMarket.waitForDeployment();

    const NFTMarketplace = await ethers.getContractFactory('NFTMarketplace');
    const nftMarketplace = await NFTMarketplace.deploy(owner, nftMarket);
    await nftMarketplace.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { nftMarketplace, nftMarket, owner, addr1, addr2 };
  }

  async function marketplaceFixture() {
    const { nftMarketplace, nftMarket, owner, addr1, addr2 } =
      await loadFixture(deployFixture);

    // Mint the NFT to addr1
    await nftMarket.mint(addr1);

    // Approve the marketplace contract to handle the token
    await nftMarket.connect(addr1).approve(nftMarketplace, 0);

    // List the NFT on the marketplace
    const tx = await nftMarketplace
      .connect(addr1)
      .listNFT(0, ethers.parseEther('0.05'));
    await tx.wait();

    return { tx, nftMarketplace, nftMarket, owner, addr1, addr2 };
  }

  describe('Deployment', function () {
    it('Should have the correct name and symbol', async function () {
      const { nftMarketplace, nftMarket } = await loadFixture(deployFixture);
      expect(await nftMarket.name()).to.equal('RobotsNFT');
      expect(await nftMarket.symbol()).to.equal('RNFT');
      expect(await nftMarketplace.nftContract()).to.equal(nftMarket);
    });
  });

  describe('Mint token', function () {
    it('Should have the correct recipient address', async function () {
      const { nftMarket, owner, addr1 } = await loadFixture(deployFixture);

      // Mint the NFT to addr1
      await nftMarket.mint(addr1);

      // Verify the owner of the nft is correct
      expect(await nftMarket.ownerOf(0)).to.equal(addr1.address);
    });

    it('Should have the correct token URI', async function () {
      const { nftMarket, owner, addr1 } = await loadFixture(deployFixture);

      // Mint the NFT to addr1
      await nftMarket.mint(addr1);

      // Verify the token URI is correct
      expect(await nftMarket.tokenURI(0)).to.equal(
        'https://api.example.com/metadata/0'
      );
    });
  });

  describe('Marketplace', function () {
    it('Should list an NFT correctly', async function () {
      const { tx, nftMarketplace, owner, addr1 } = await loadFixture(
        marketplaceFixture
      );

      // Verify the event was emitted correctly
      await expect(tx)
        .to.emit(nftMarketplace, 'NFTListed')
        .withArgs(0, 0, addr1.address, ethers.parseEther('0.05')); // Correct the index for args

      // Verify the listing details
      const listing = await nftMarketplace.getListing(0);
      expect(listing.tokenId.toString()).to.equal('0');
      expect(listing.price.toString()).to.equal('50000000000000000');
      expect(listing.seller).to.equal(addr1.address);
      expect(listing.sold).to.be.false;
    });

    it('Should allow buying an NFT', async function () {
      const { nftMarketplace, owner, addr1, addr2 } = await loadFixture(
        marketplaceFixture
      );

      const txBuyNFT = await nftMarketplace
        .connect(addr2)
        .buyNFT(0, { value: ethers.parseEther('0.05') });
      // Verify the event was emitted correctly
      await expect(txBuyNFT)
        .to.emit(nftMarketplace, 'NFTSold')
        .withArgs(0, 0, addr2.address, ethers.parseEther('0.05'));

      const listing = await nftMarketplace.getListing(0);
      expect(listing.sold).to.be.true;
    });

    it('Should revert if the price is incorrect', async function () {
      const { nftMarketplace, owner, addr1, addr2 } = await loadFixture(
        marketplaceFixture
      );

      // Attempt to buy with incorrect price
      await expect(
        nftMarketplace
          .connect(addr2)
          .buyNFT(0, { value: ethers.parseEther('0.001') })
      ).to.be.revertedWith('Incorrect price');
    });

    it('Should revert if the NFT is already sold', async function () {
      const { nftMarketplace, owner, addr1, addr2 } = await loadFixture(
        marketplaceFixture
      );

      await nftMarketplace
        .connect(addr2)
        .buyNFT(0, { value: ethers.parseEther('0.05') });

      // Attempt to buy the same NFT again
      await expect(
        nftMarketplace
          .connect(addr2)
          .buyNFT(0, { value: ethers.parseEther('0.05') })
      ).to.be.revertedWith('NFT already sold');
    });
  });
});
