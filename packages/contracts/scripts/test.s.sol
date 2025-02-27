// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Contract.sol";
import "../test/GitcoinPassportDecoderMock.sol";
import "../test/ERC20Mock.sol";
import "../test/AavePoolMock.sol";
import "eas-proxy/IGitcoinPassportDecoder.sol";

contract Test is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address trustBondContract = vm.envAddress("CONTRACT_ADDRESS");
        TrustBond trustBond = TrustBond(trustBondContract);
        uint256 balance = trustBond.communityPoolBalance();
        console.log("Balance:", balance);

        address tokenAddress = vm.envAddress("TESTNET_TOKEN");
        ERC20 token = ERC20(tokenAddress);
        uint256 tokenBalance = token.balanceOf(address(trustBond));
        console.log("Token balance:", tokenBalance);

        token.approve(address(trustBond), 100);

        address partner = 0x0000000000000000000000000000000000000000;
        uint256 amount = 100;
        trustBond.deposit(amount, partner);

        vm.stopBroadcast();
    }
}