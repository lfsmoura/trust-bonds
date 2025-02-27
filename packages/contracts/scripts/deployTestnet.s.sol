// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Contract.sol";
import "../test/GitcoinPassportDecoderMock.sol";
import "../test/ERC20Mock.sol";
import "../test/AavePoolMock.sol";

contract DeployTestnet is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Load addresses from environment variables
        address passportDecoderAddress = vm.envAddress("TESTNET_PASSPORT_DECODER");
        address tokenAddress = vm.envAddress("TESTNET_TOKEN"); 
        address poolAddress = vm.envAddress("TESTNET_POOL");
        address trustBondOwner = vm.envAddress("TESTNET_OWNER");
        address atokenAddress = vm.envAddress("TESTNET_ATOKEN");
        // Use provided addresses for dependencies
        IGitcoinPassportDecoder passportDecoder = IGitcoinPassportDecoder(passportDecoderAddress);
        IERC20 token = IERC20(tokenAddress);
        IPool pool = IPool(poolAddress);
        IERC20 atoken = IERC20(atokenAddress);
        // Deploy TrustBond contract
        TrustBond trustBond = new TrustBond(
            trustBondOwner,
            passportDecoder,
            pool,
            token,
            atoken
        );

        console.log("TrustBond deployed at:", address(trustBond));
        console.log("Using GitcoinPassportDecoder at:", passportDecoderAddress);
        console.log("Using ERC20 token at:", tokenAddress);
        console.log("Using AavePool at:", poolAddress);

        vm.stopBroadcast();
    }
}
