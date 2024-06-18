// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarket is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;

    constructor(
        address initialOwner
    ) ERC721("RobotsNFT", "RNFT") Ownable(initialOwner) {}

    function mint(
        address to,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        _safeMint(to, nextTokenId);
        _setTokenURI(nextTokenId, tokenURI);
        nextTokenId++;
        return nextTokenId;
    }
}
