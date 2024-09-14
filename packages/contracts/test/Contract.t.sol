// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "forge-std/Test.sol";

import "../src/Contract.sol";
import "./GitcoinPassportDecoderMock.sol";
import "./ERC20Mock.sol";
import "./AavePoolMock.sol";

contract TestContract is Test {
    TrustBond c;
    GitcoinPassportDecoderMock passportDecoder;
    uint256 private userCounter;
    ERC20 token;
    AavePoolMock pool;
    function setUp() public {
        passportDecoder = new GitcoinPassportDecoderMock();
        pool = new AavePoolMock();
        token = new ERC20Mock("Test", "TEST");
        c = new TrustBond(address(passportDecoder), passportDecoder, IPool(address(pool)), IERC20(address(token)));
        userCounter = 0;
    }

    function testCantCreateBondWithoutPassport() public {
        address user = getUser();
        token.transfer(user, 100);
        vm.expectRevert();
        c.deposit(100, getUser());
    }

    function testCantCreateBondWithUserWithoutPassport() public {
        address user = getUser();
        token.transfer(user, 100);
        passportDecoder.setScore(user, 100);
        vm.expectRevert();
        vm.prank(user);
        c.deposit(100, getUser());
    }

    function testCanCreateBondWithUserWithPassport() public {
        address user = getUser();
        passportDecoder.setScore(user, 30);
        token.transfer(user, 100);
        address user2 = getUser();
        passportDecoder.setScore(user2, 30);
        vm.prank(user);
        c.deposit(100, user2);
    }

    function getUser() internal returns (address) {
        userCounter++;
        return address(uint160(uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, userCounter)))));
    }
}
