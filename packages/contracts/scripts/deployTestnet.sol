// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Contract.sol";
import "../test/GitcoinPassportDecoderMock.sol";
import "../test/ERC20Mock.sol";
import "../test/AavePoolMock.sol";

contract DeployTestnet is Script {
    function run(
        address passportDecoderAddress,
        address tokenAddress,
        address poolAddress,
        address trustBondOwner
    ) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Use provided addresses for dependencies
        IGitcoinPassportDecoder passportDecoder = IGitcoinPassportDecoder(passportDecoderAddress);
        IERC20 token = IERC20(tokenAddress);
        IPool pool = IPool(poolAddress);

        // Deploy TrustBond contract
        TrustBond trustBond = new TrustBond(
            trustBondOwner,
            passportDecoder,
            pool,
            token
        );

        console.log("TrustBond deployed at:", address(trustBond));
        console.log("Using GitcoinPassportDecoder at:", passportDecoderAddress);
        console.log("Using ERC20 token at:", tokenAddress);
        console.log("Using AavePool at:", poolAddress);

        vm.stopBroadcast();
    }
}
