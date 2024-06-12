// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarket is ERC721, Ownable {
    uint256 public nextTokenId;

    constructor(
        address initialOwner
    ) ERC721("RobotsNFT", "RNFT") Ownable(initialOwner) {}

    function mint(address to) external onlyOwner {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "https://api.example.com/metadata/";
    }
}
