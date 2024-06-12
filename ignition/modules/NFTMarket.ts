const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

const NAME = '';
const SYMBOL = '';

module.exports = buildModule('NFTMarketModule', (m: any) => {
  const owner = m.getAccount(0);
  const nftMarket = m.contract('NFTMarket', [owner]);

  return { nftMarket };
});
