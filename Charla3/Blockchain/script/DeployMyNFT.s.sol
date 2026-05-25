// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MyNFT.sol";

contract DeployMyNFT is Script {
    function run() external returns (MyNFT) {
        uint256 deployerPrivateKey = vm.parseUint(string.concat("0x", vm.promptSecret("Ingresa tu private key (sin 0x)")));

        vm.startBroadcast(deployerPrivateKey);

        MyNFT nft = new MyNFT("MyNFT", "MNFT");

        vm.stopBroadcast();

        console.log("MyNFT deployed at:", address(nft));

        return nft;
    }
}
