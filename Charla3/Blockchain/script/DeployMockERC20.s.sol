// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockERC20.sol";

contract DeployMockERC20 is Script {
    function run() external returns (MockERC20) {
        uint256 deployerPrivateKey = vm.parseUint(string.concat("0x", vm.promptSecret("Ingresa tu private key (sin 0x)")));

        vm.startBroadcast(deployerPrivateKey);

        MockERC20 token = new MockERC20("Mock Token", "MOCK");

        vm.stopBroadcast();

        console.log("MockERC20 deployed at:", address(token));

        return token;
    }
}
