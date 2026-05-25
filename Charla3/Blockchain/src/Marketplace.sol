// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

interface IERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function transferFrom(address from, address to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (address);
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}

contract Marketplace {
    struct Listing {
        address nftContract;
        uint256 tokenId;
        uint256 price;
        address seller;
        bool active;
    }

    address public immutable paymentToken;
    uint256 private _nextListingId;

    mapping(uint256 => Listing) private _listings;

    event Listed(uint256 indexed listingId, address indexed nftContract, uint256 indexed tokenId, address seller, uint256 price);
    event Sold(uint256 indexed listingId, address indexed buyer, uint256 price);
    event Cancelled(uint256 indexed listingId);

    constructor(address _paymentToken) {
        require(_paymentToken != address(0), "Zero address");
        paymentToken = _paymentToken;
    }

    function listItem(address nftContract, uint256 tokenId, uint256 price) external returns (uint256) {
        require(price > 0, "Price must be > 0");
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(
            nft.getApproved(tokenId) == address(this) ||
            nft.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );

        uint256 listingId = _nextListingId++;
        _listings[listingId] = Listing({
            nftContract: nftContract,
            tokenId: tokenId,
            price: price,
            seller: msg.sender,
            active: true
        });

        emit Listed(listingId, nftContract, tokenId, msg.sender, price);
        return listingId;
    }

    function buyItem(uint256 listingId) external {
        Listing storage listing = _listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.seller != msg.sender, "Cannot buy your own listing");

        listing.active = false;

        bool paid = IERC20(paymentToken).transferFrom(msg.sender, listing.seller, listing.price);
        require(paid, "Payment failed");
        IERC721(listing.nftContract).transferFrom(listing.seller, msg.sender, listing.tokenId);

        emit Sold(listingId, msg.sender, listing.price);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = _listings[listingId];
        require(listing.active, "Listing not active");
        require(listing.seller == msg.sender, "Not the seller");

        listing.active = false;
        emit Cancelled(listingId);
    }

    function getListing(uint256 listingId) external view returns (Listing memory) {
        return _listings[listingId];
    }

    function getActiveListings() external view returns (Listing[] memory, uint256[] memory) {
        uint256 total = _nextListingId;
        uint256 count;

        for (uint256 i = 0; i < total; i++) {
            if (_listings[i].active) count++;
        }

        Listing[] memory active = new Listing[](count);
        uint256[] memory ids = new uint256[](count);
        uint256 idx;

        for (uint256 i = 0; i < total; i++) {
            if (_listings[i].active) {
                active[idx] = _listings[i];
                ids[idx] = i;
                idx++;
            }
        }

        return (active, ids);
    }

    function totalListings() external view returns (uint256) {
        return _nextListingId;
    }
}
