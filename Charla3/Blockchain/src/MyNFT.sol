// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MyNFT {
    string public name;
    string public symbol;

    address public owner;
    uint256 private _nextTokenId;
    string private _baseURI;

    mapping(uint256 => address) private _ownerOf;
    mapping(address => uint256) private _balanceOf;
    mapping(uint256 => address) private _approvals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
    }

    function setBaseURI(string calldata baseURI_) external onlyOwner {
        _baseURI = baseURI_;
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(_ownerOf[tokenId] != address(0), "Token does not exist");
        return string(abi.encodePacked(_baseURI, _toString(tokenId)));
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + value % 10));
            value /= 10;
        }
        return string(buffer);
    }

    function balanceOf(address _owner) external view returns (uint256) {
        require(_owner != address(0), "Zero address");
        return _balanceOf[_owner];
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        address tokenOwner = _ownerOf[tokenId];
        require(tokenOwner != address(0), "Token does not exist");
        return tokenOwner;
    }

    function approve(address to, uint256 tokenId) external {
        address tokenOwner = _ownerOf[tokenId];
        require(msg.sender == tokenOwner || _operatorApprovals[tokenOwner][msg.sender], "Not authorized");
        _approvals[tokenId] = to;
        emit Approval(tokenOwner, to, tokenId);
    }

    function getApproved(uint256 tokenId) external view returns (address) {
        require(_ownerOf[tokenId] != address(0), "Token does not exist");
        return _approvals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) external {
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address _owner, address operator) external view returns (bool) {
        return _operatorApprovals[_owner][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_ownerOf[tokenId] == from, "Wrong owner");
        require(to != address(0), "Zero address");
        require(
            msg.sender == from ||
            _approvals[tokenId] == msg.sender ||
            _operatorApprovals[from][msg.sender],
            "Not authorized"
        );

        _balanceOf[from]--;
        _balanceOf[to]++;
        _ownerOf[tokenId] = to;
        delete _approvals[tokenId];

        emit Transfer(from, to, tokenId);
    }

    function mint(address to) external onlyOwner returns (uint256) {
        require(to != address(0), "Zero address");
        uint256 tokenId = _nextTokenId++;
        _ownerOf[tokenId] = to;
        _balanceOf[to]++;
        emit Transfer(address(0), to, tokenId);
        return tokenId;
    }
}
