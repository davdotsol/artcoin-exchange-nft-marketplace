// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.24;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is Ownable, ReentrancyGuard {
    struct Listing {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool sold;
    }

    IERC721 public nftContract;
    mapping(uint256 => Listing) public listings;
    uint256 public listingCount;

    event NFTListed(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );

    constructor(
        address _initialOwner,
        address _nftContract
    ) Ownable(_initialOwner) {
        nftContract = IERC721(_nftContract);
    }

    function listNFT(uint256 tokenId, uint256 price) external nonReentrant {
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "You do not own this NFT"
        );
        require(price > 0, "Price must be greater than zero");

        nftContract.transferFrom(msg.sender, address(this), tokenId);

        listings[listingCount] = Listing({
            tokenId: tokenId,
            seller: payable(msg.sender),
            price: price,
            sold: false
        });

        emit NFTListed(listingCount, tokenId, msg.sender, price);
        listingCount++;
    }

    function buyNFT(uint256 listingId) external payable nonReentrant {
        require(false, "Not implemented yet: buyNFT.");
        console.log("buy NFT", listingId);
    }

    function getListing(
        uint256 listingId
    ) external view returns (Listing memory) {
        return listings[listingId];
    }
}
