export const ERC721MinABI = [
  { "type": "function", "name": "name", "inputs": [], "outputs": [{ "type": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "symbol", "inputs": [], "outputs": [{ "type": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "ownerOf", "inputs": [{ "name": "tokenId", "type": "uint256" }], "outputs": [{ "type": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "balanceOf", "inputs": [{ "name": "_owner", "type": "address" }], "outputs": [{ "type": "uint256" }], "stateMutability": "view" },
  { "type": "function", "name": "tokenURI", "inputs": [{ "name": "tokenId", "type": "uint256" }], "outputs": [{ "type": "string" }], "stateMutability": "view" },
  { "type": "function", "name": "approve", "inputs": [{ "name": "to", "type": "address" }, { "name": "tokenId", "type": "uint256" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "setApprovalForAll", "inputs": [{ "name": "operator", "type": "address" }, { "name": "approved", "type": "bool" }], "outputs": [], "stateMutability": "nonpayable" },
  { "type": "function", "name": "getApproved", "inputs": [{ "name": "tokenId", "type": "uint256" }], "outputs": [{ "type": "address" }], "stateMutability": "view" },
  { "type": "function", "name": "isApprovedForAll", "inputs": [{ "name": "owner", "type": "address" }, { "name": "operator", "type": "address" }], "outputs": [{ "type": "bool" }], "stateMutability": "view" },
  { "type": "function", "name": "totalSupply", "inputs": [], "outputs": [{ "type": "uint256" }], "stateMutability": "view" }
];
