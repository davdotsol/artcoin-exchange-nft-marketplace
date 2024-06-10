// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarket is ERC721URIStorage {
    constructor() ERC721("RobotsNFT", "RNFT") {}
}
