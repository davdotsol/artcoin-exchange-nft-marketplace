// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.24;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is Ownable, ReentrancyGuard {
    IERC721 public nftContract;

    constructor(
        address _initialOwner,
        address _nftContract
    ) Ownable(_initialOwner) {
        nftContract = IERC721(_nftContract);
    }

    function listNFT(uint256 tokenId, uint256 price) external nonReentrant {
        require(false, "Not implemented yet: listNFT.");
        console.log("list NFT", tokenId, price);
    }

    function buyNFT(uint256 listingId) external payable nonReentrant {
        require(false, "Not implemented yet: buyNFT.");
        console.log("buy NFT", listingId);
    }
}
