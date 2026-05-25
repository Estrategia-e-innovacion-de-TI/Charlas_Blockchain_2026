export const MarketplaceABI = [
  { "type": "constructor", "inputs": [{ "name": "_paymentToken", "type": "address" }], "stateMutability": "nonpayable" },
  { "type": "function", "name": "paymentToken", "inputs": [], "outputs": [{ "type": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "listItem", "inputs": [{ "name": "nftContract", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "price", "type": "uint256" }], "outputs": [{ "type": "uint256" }], "stateMutability": "nonpayable" },
  { "type": "function", "name": "buyItem", "inputs": [{ "name": "listingId", "type": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "cancelListing", "inputs": [{ "name": "listingId", "type": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "getListing", "inputs": [{ "name": "listingId", "type": "uint256" }], "outputs": [{ "name": "", "type": "tuple", "components": [{ "name": "nftContract", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "price", "type": "uint256" }, { "name": "seller", "type": "address" }, { "name": "active", "type": "bool" }] }], "stateMutability": "view" },
  { "type": "function", "name": "getActiveListings", "inputs": [], "outputs": [{ "name": "", "type": "tuple[]", "components": [{ "name": "nftContract", "type": "address" }, { "name": "tokenId", "type": "uint256" }, { "name": "price", "type": "uint256" }, { "name": "seller", "type": "address" }, { "name": "active", "type": "bool" }] }, { "name": "", "type": "uint256[]" }], "stateMutability": "view" },
  { "type": "function", "name": "totalListings", "inputs": [], "outputs": [{ "type": "uint256" }], "stateMutability": "view" },
  { "type": "event", "name": "Listed", "inputs": [{ "name": "listingId", "type": "uint256", "indexed": true }, { "name": "nftContract", "type": "address", "indexed": true }, { "name": "tokenId", "type": "uint256", "indexed": true }, { "name": "seller", "type": "address", "indexed": false }, { "name": "price", "type": "uint256", "indexed": false }] },
  { "type": "event", "name": "Sold", "inputs": [{ "name": "listingId", "type": "uint256", "indexed": true }, { "name": "buyer", "type": "address", "indexed": true }, { "name": "price", "type": "uint256", "indexed": false }] },
  { "type": "event", "name": "Cancelled", "inputs": [{ "name": "listingId", "type": "uint256", "indexed": true }] }
];
