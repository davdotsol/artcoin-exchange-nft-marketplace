const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

const NAME = '';
const SYMBOL = '';

const NFTModule = buildModule('NFTMarketModule', (m) => {
  const owner = m.getAccount(0);
  const nftMarket = m.contract('NFTMarket', [owner]);

  return { nftMarket };
});

module.exports = buildModule('NFTMarketplaceModule', (m) => {
  const { nftMarket } = m.useModule(NFTModule);

  const owner = m.getAccount(0);
  const nftMarketplace = m.contract('NFTMarketplace', [owner, nftMarket]);

  return { nftMarketplace };
});
