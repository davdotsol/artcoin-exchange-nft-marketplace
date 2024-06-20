// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.24;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarketplace is Ownable, ReentrancyGuard {
    struct NFTItem {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool isListed;
    }

    IERC721 public nftContract;
    mapping(uint256 => NFTItem) public nftItems;
    uint256 public nftItemCount;
    mapping(address => uint256[]) private ownedNFTs;
    mapping(address => mapping(uint256 => uint256)) private ownedNFTsIndex;
    mapping(uint256 => bool) public tokenIdToListingExists;
    uint256[] public tokenIds;

    event NFTListed(
        uint256 indexed nftItemId,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );
    event NFTSold(
        uint256 indexed nftItemId,
        uint256 indexed tokenId,
        address buyer,
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

        if (tokenIdToListingExists[tokenId]) {
            NFTItem storage item = nftItems[tokenId];

            // Update the listing
            item.seller = payable(msg.sender);
            item.price = price;
            item.isListed = true;

            emit NFTListed(nftItemCount, tokenId, msg.sender, price);
        } else {
            nftItems[nftItemCount] = NFTItem({
                tokenId: tokenId,
                seller: payable(msg.sender),
                price: price,
                isListed: true
            });
            tokenIdToListingExists[tokenId] = true;
            tokenIds.push(tokenId);
            emit NFTListed(nftItemCount, tokenId, msg.sender, price);
            nftItemCount++;
        }

        if (ownedNFTs[msg.sender].length > 0) {
            _removeOwnedNFT(msg.sender, tokenId);
        }
    }

    function buyNFT(uint256 nftItemId) external payable nonReentrant {
        NFTItem storage nftItem = nftItems[nftItemId];
        require(msg.value == nftItem.price, "Incorrect price");
        require(nftItem.isListed, "NFT must be listed");
        nftItem.seller.transfer(msg.value);
        nftContract.transferFrom(address(this), msg.sender, nftItem.tokenId);
        nftItem.isListed = false;
        _addOwnedNFT(msg.sender, nftItem.tokenId);
        emit NFTSold(nftItemId, nftItem.tokenId, msg.sender, nftItem.price);
    }

    function getNFTItem(
        uint256 nftItemId
    ) external view returns (NFTItem memory) {
        return nftItems[nftItemId];
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
