// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Marketplace.sol";

contract DeployMarketplace is Script {
    function run() external returns (Marketplace) {
        address paymentToken = vm.envAddress("MOCK_ERC20_ADDRESS");
        uint256 deployerPrivateKey = vm.parseUint(string.concat("0x", vm.promptSecret("Ingresa tu private key (sin 0x)")));

        vm.startBroadcast(deployerPrivateKey);

        Marketplace marketplace = new Marketplace(paymentToken);

        vm.stopBroadcast();

        console.log("Marketplace deployed at:", address(marketplace));
        console.log("Payment token:          ", paymentToken);

        return marketplace;
    }
}
