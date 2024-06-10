const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

const NAME = '';
const SYMBOL = '';

module.exports = buildModule('NFTMarketModule', (m) => {
  const nftMarket = m.contract('NFTMarket');

  return { nftMarket };
});
