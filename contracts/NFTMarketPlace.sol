// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.24;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is Ownable, ReentrancyGuard {
    struct NFTItem {
        address nftContract;
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool isListed;
    }

    struct Bid {
        address payable bidder;
        uint256 bidAmount;
    }

    mapping(address => mapping(uint256 => NFTItem)) public nftItems; // nftContract => tokenId => NFTItem
    mapping(address => mapping(uint256 => Bid)) public nftBids; // nftContract => tokenId => Bid
    mapping(address => uint256[]) private ownedNFTs;
    mapping(address => mapping(uint256 => uint256)) private ownedNFTsIndex;

    event NFTListed(
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );
    event NFTSold(
        address indexed nftContract,
        uint256 indexed tokenId,
        address buyer,
        uint256 price
    );
    event BidPlaced(
        address indexed nftContract,
        uint256 indexed tokenId,
        address bidder,
        uint256 bidAmount
    );
    event BidAccepted(
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address buyer,
        uint256 bidAmount
    );

    constructor(address _initialOwner) Ownable(_initialOwner) {}

    function listNFT(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant {
        require(
            IERC721(nftContract).ownerOf(tokenId) == msg.sender,
            "You do not own this NFT"
        );
        require(price > 0, "Price must be greater than zero");

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        NFTItem storage item = nftItems[nftContract][tokenId];
        item.nftContract = nftContract;
        item.tokenId = tokenId;
        item.seller = payable(msg.sender);
        item.price = price;
        item.isListed = true;

        emit NFTListed(nftContract, tokenId, msg.sender, price);
    }

    function buyNFT(
        address nftContract,
        uint256 tokenId
    ) external payable nonReentrant {
        NFTItem storage nftItem = nftItems[nftContract][tokenId];
        require(msg.value == nftItem.price, "Incorrect price");
        require(nftItem.isListed, "NFT must be listed");

        if (ownedNFTs[nftItem.seller].length > 0) {
            _removeOwnedNFT(nftItem.seller, tokenId);
        }

        nftItem.seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        nftItem.isListed = false;

        _addOwnedNFT(msg.sender, tokenId);

        emit NFTSold(nftContract, tokenId, msg.sender, nftItem.price);
    }

    function placeBid(
        address nftContract,
        uint256 tokenId
    ) external payable nonReentrant {
        require(msg.value > 0, "Bid amount must be greater than zero");

        Bid storage existingBid = nftBids[nftContract][tokenId];
        require(
            msg.value > existingBid.bidAmount,
            "There is already a higher or equal bid"
        );

        // Refund previous bidder
        if (existingBid.bidAmount > 0) {
            existingBid.bidder.transfer(existingBid.bidAmount);
        }

        nftBids[nftContract][tokenId] = Bid({
            bidder: payable(msg.sender),
            bidAmount: msg.value
        });

        emit BidPlaced(nftContract, tokenId, msg.sender, msg.value);
    }

    function acceptBid(
        address nftContract,
        uint256 tokenId
    ) external nonReentrant {
        NFTItem storage nftItem = nftItems[nftContract][tokenId];
        require(
            nftItem.seller == msg.sender,
            "Only the seller can accept bids"
        );

        Bid storage bid = nftBids[nftContract][tokenId];
        require(bid.bidAmount > 0, "No bids available");

        // Transfer the NFT to the highest bidder
        IERC721(nftContract).transferFrom(address(this), bid.bidder, tokenId);
        nftItem.seller.transfer(bid.bidAmount);

        nftItem.isListed = false;

        emit BidAccepted(
            nftContract,
            tokenId,
            msg.sender,
            bid.bidder,
            bid.bidAmount
        );
    }

    function getNFTItem(
        address nftContract,
        uint256 tokenId
    ) external view returns (NFTItem memory) {
        return nftItems[nftContract][tokenId];
    }

    function getOwnedNFTs(
        address owner
    ) external view returns (uint256[] memory) {
        return ownedNFTs[owner];
    }

    function _addOwnedNFT(address owner, uint256 tokenId) internal {
        uint256 length = ownedNFTs[owner].length;
        ownedNFTs[owner].push(tokenId);
        ownedNFTsIndex[owner][tokenId] = length;
    }

    function _removeOwnedNFT(address owner, uint256 tokenId) internal {
        uint256 lastTokenIndex = ownedNFTs[owner].length - 1;
        uint256 tokenIndex = ownedNFTsIndex[owner][tokenId];

        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = ownedNFTs[owner][lastTokenIndex];

            ownedNFTs[owner][tokenIndex] = lastTokenId;
            ownedNFTsIndex[owner][lastTokenId] = tokenIndex;
        }

        ownedNFTs[owner].pop();
        delete ownedNFTsIndex[owner][tokenId];
    }
}
