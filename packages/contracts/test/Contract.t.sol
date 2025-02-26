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
    ERC20 atoken;

    function setUp() public {
        passportDecoder = new GitcoinPassportDecoderMock();
        token = new ERC20Mock("Test", "TEST");
        pool = new AavePoolMock(address(token));
        atoken = ERC20(pool.getAToken());
        c = new TrustBond(
            address(passportDecoder),
            passportDecoder,
            IPool(address(pool)),
            IERC20(address(token)),
            IERC20(address(atoken))
        );
        userCounter = 0;
    }

    function testCantCreateBondWithoutPassport() public {
        // Generate a new user address
        address user = getUser();
        // Transfer 100 tokens to the user
        token.transfer(user, 100);
        vm.prank(user);
        token.approve(address(c), 100);
        // Expect the next call to revert because the user doesn't have a passport score
        vm.prank(user);
        vm.expectRevert();
        // Attempt to deposit 100 tokens for a new user without a passport score
        c.deposit(100, getUser());
    }

    function testCantCreateBondWithUserWithoutPassport() public {
        // Generate a new user address
        address user = getUser();
        // Transfer 100 tokens to the user
        token.transfer(user, 100);
        vm.prank(user);
        token.approve(address(c), 100);
        // Set the user's passport score to 100
        passportDecoder.setScore(user, 100);
        // Expect the next call to revert because the recipient doesn't have a passport score
        vm.expectRevert();
        // Simulate the user making the call
        vm.prank(user);
        // Attempt to deposit 100 tokens for a new user without a passport score
        c.deposit(100, getUser());
    }

    function testCanCreateBondWithUserWithPassport() public {
        // Generate a new user address
        address user = getUser();
        // Set the user's passport score to 30
        passportDecoder.setScore(user, 30);
        // Transfer 100 tokens to the user
        token.transfer(user, 100);
        // Generate another user address
        address user2 = getUser();
        // Set the second user's passport score to 30
        passportDecoder.setScore(user2, 30);
        // Simulate the first user making the call
        vm.prank(user);
        token.approve(address(c), 100);
        vm.prank(user);
        // Successfully deposit 100 tokens for the second user
        c.deposit(100, user2);
    }

    function testFindABond() public {
        // Generate two user addresses
        address user1 = getUser();
        address user2 = getUser();
        // Create a bond between the two users
        createValidBond(user1, 100, user2, 100);
        // Retrieve the bond between the two users
        Bond memory bond = c.bond(user1, user2);
        // Assert existance of bond
        assertEq(bond.partner, user2);
        Bond memory bondReverse = c.bond(user2, user1);
        assertEq(bondReverse.partner, user1);
    }

    function testFuzz_BreakABond(
        uint256 user1Amount,
        uint256 user2Amount
    ) public {
        user1Amount = (user1Amount % 1000000000) + 1;
        user2Amount = (user2Amount % 1000000000) + 1;
        // Generate two user addresses
        address user1 = getUser();
        address user2 = getUser();
        // Create a bond between the two users
        createValidBond(user1, user1Amount, user2, user2Amount);
        // Retrieve the bonds between the two users
        Bond memory bond1 = c.bond(user1, user2);
        assertEq(bond1.partner, user2);
        Bond memory bond2 = c.bond(user2, user1);
        assertEq(bond2.partner, user1);

        // Retrieve user2 Balance Before Breaking the Bond
        uint256 user2BalanceBeforeBreaking = token.balanceOf(user2);

        // Retrieve bond amount before breaking the bond
        uint256 bondBalanceBeforeBreaking = bond1.amount + bond2.amount;

        // Retrieve contract balance before breaking the bond
        uint256 contractBalanceBeforeBreaking = atoken.balanceOf(address(c));

        // Retrieve the bond break fee
        uint256 fee = c.breakFee();

        // Simulate the first user making the call
        vm.prank(user1);
        // Break the bond between the two users
        c.breakBond(user2);
        // Retrieve user1's balance after breaking the bond
        uint256 user1BalanceAfterBreaking = token.balanceOf(user1);
        // Retrieve user2's balance after breaking the bond
        uint256 user2BalanceAfterBreaking = token.balanceOf(user2);
        // Retrieve TrustBond balance after breaking the bond
        uint256 contractBalanceAfterBreaking = token.balanceOf(address(c));

        // Assert that user1 has been charged the break fee
        assertEq(
            user1BalanceAfterBreaking,
            bondBalanceBeforeBreaking - (bondBalanceBeforeBreaking * fee) / 100
        );

        // Check for user2's not recieving any funds due to the bond being broken
        assertEq(user2BalanceAfterBreaking, user2BalanceBeforeBreaking);

        // Check for the contract balance to retain the fees after breaking the bond
        assertEq(
            (user1BalanceAfterBreaking + contractBalanceAfterBreaking),
            contractBalanceBeforeBreaking
        );
    }

    function testFuzz_BreakABondTwice(
        uint256 user1Amount,
        uint256 user2Amount
    ) public {
        user1Amount = (user1Amount % 1000000000) + 1;
        user2Amount = (user2Amount % 1000000000) + 1;
        // Generate two user addresses
        address user1 = getUser();
        address user2 = getUser();
        // Create a bond between the two users
        createValidBond(user1, user1Amount, user2, user2Amount);
        // Retrieve the bond between the two users
        Bond memory bond1 = c.bond(user1, user2);
        Bond memory bond2 = c.bond(user2, user1);
        assertEq(bond1.partner, user2);
        assertEq(bond2.partner, user1);
        // Retrieve the balance of the bond before breaking
        uint256 bondBalanceBeforeBreaking = bond1.amount + bond2.amount;
        // Retrieve bond break fee
        uint256 fee = c.breakFee();
        // Retrieve user2 balance before breaking the bond
        uint256 user2BalanceBeforeBreaking = token.balanceOf(user2);
        // Retrieve contract balance before breaking the bond
        uint256 contractBalanceBeforeBreaking = atoken.balanceOf(address(c));
        // Simulate the first user making the call
        vm.prank(user1);
        // Break the bond between the two users
        c.breakBond(user2);
        // Retrieve user1 balance after breaking the bond
        uint256 user1BalanceAfterBreaking = token.balanceOf(user1);
        // Assert that user1 has been charged the break fee
        assertEq(
            user1BalanceAfterBreaking,
            bondBalanceBeforeBreaking - (bondBalanceBeforeBreaking * fee) / 100
        );
        // Retrieve user2 balance after breaking the bond
        uint256 user2BalanceAfterBreaking = token.balanceOf(user2);
        // Assert that user2 recieved no funds after breaking the bond
        assertEq(user2BalanceAfterBreaking, user2BalanceBeforeBreaking);
        // Retrieve the TrustBond balance after breaking the bond
        uint256 contractBalanceAfterBreaking = token.balanceOf(address(c));

        // Assert that the TrustBond retains the fees after breaking the bond
        assertEq(
            contractBalanceBeforeBreaking,
            user1BalanceAfterBreaking + contractBalanceAfterBreaking
        );

        // Expect the next call to revert because the bond has already been broken
        vm.expectRevert();
        // Attempt to break the bond again
        c.breakBond(user2);
        // Assert that user1 balance is unchanged after the second attempt
        assertEq(token.balanceOf(user1), user1BalanceAfterBreaking);
        // Assert that user2 balance is unchanged after the second attempt
        assertEq(token.balanceOf(user2), user2BalanceAfterBreaking);
        // Assert that the contract balance is unchanged after the second attempt
        assertEq(token.balanceOf(address(c)), contractBalanceAfterBreaking);
    }

    function testFuzz_BreakABondWithoutAPartner(
        uint256 user1Amount,
        uint256 user2Amount
    ) public {
        user1Amount = (user1Amount % 1000000000) + 1;
        user2Amount = (user2Amount % 1000000000) + 1;
        // Generate two user addresses
        address user1 = getUser();
        address user2 = getUser();
        // Create a bond between the two users
        createValidBond(user1, user1Amount, user2, user2Amount);
        // Retrieve the bond between the two users
        Bond memory bond = c.bond(user1, user2);
        assertEq(bond.partner, user2);
        // Retrieve the balance of the community pool before breaking the bond
        uint256 contractBalanceBeforeBraking = atoken.balanceOf(address(c));
        // Retrieve user1 Balance before attempting to break the bond
        uint256 user1BalanceBeforeBreaking = token.balanceOf(user1);
        // Retrieve user2 Balance before attempting to break the bond
        uint256 user2BalanceBeforeBreaking = token.balanceOf(user2);
        // Expect the next call to revert for trying to break a bond that has no partner
        vm.expectRevert();
        // Simulate the first user making the call
        vm.prank(user1);
        // Break a bond without pointing a partner
        c.breakBond(address(0));
        // Verify that user1's balance is unaltered
        assertEq(token.balanceOf(user1), user1BalanceBeforeBreaking);
        // Verify that user2's balance is unaltered
        assertEq(token.balanceOf(user2), user2BalanceBeforeBreaking);
        // Verify the contract balance to be unaltered
        assertEq(atoken.balanceOf(address(c)), contractBalanceBeforeBraking);
    }

    function testFuzz_BreakABondWithWrongPartner(
        uint256 user1Amount,
        uint256 user2Amount,
        uint256 user3Amount
    ) public {
        user1Amount = (user1Amount % 1000000000) + 1;
        user2Amount = (user2Amount % 1000000000) + 1;
        user3Amount = (user3Amount % 1000000000) + 1;
        // Generate three user addresses
        address user1 = getUser();
        address user2 = getUser();
        address user3 = getUser();
        // Transfer 100 tokens to user3 as to infer existing balance on user3's account
        token.transfer(user3, 100);
        // Create a bond between user1 and user2
        createValidBond(user1, 100, user2, 100);
        // Retrieve the bond between user1 and user2
        Bond memory bond = c.bond(user1, user2);
        assertEq(bond.partner, user2);
        // Retrieve the balance of the contract before breaking the bond
        uint256 contractBalanceBeforeBreaking = atoken.balanceOf(address(c));
        // Retrieve user1 Balance before attempting to break the bond
        uint256 user1BalanceBeforeBreaking = token.balanceOf(user1);
        // Retrieve user2 Balance before attempting to break the bond
        uint256 user2BalanceBeforeBreaking = token.balanceOf(user2);
        // Retrieve user3 Balance before attempting to break the bond
        uint256 user3BalanceBeforeBreaking = token.balanceOf(user3);
        // Expect the next call to revert for trying to break a bond with the wrong partner
        vm.expectRevert();
        // Simulate the first user making the call
        vm.prank(user1);
        // Attempt to break a bond with the wrong partner
        c.breakBond(user3);
        // Check for contract balance to be unaltered
        assertEq(atoken.balanceOf(address(c)), contractBalanceBeforeBreaking);
        // Check for user1's balance to be unaltered
        assertEq(token.balanceOf(user1), user1BalanceBeforeBreaking);
        // Check for user2's balance to be unaltered
        assertEq(token.balanceOf(user2), user2BalanceBeforeBreaking);
        // Check for user3's balance to be unaltered
        assertEq(token.balanceOf(user3), user3BalanceBeforeBreaking);
    }

    function testFuzz_Withdraw(
        uint256 user1BondAmount,
        uint256 user2BondAmount
    ) public {
        user1BondAmount = (user1BondAmount % 1000000000) + 1;
        user2BondAmount = (user2BondAmount % 1000000000) + 1;

        // Generate two user addresses
        address user1 = getUser();
        address user2 = getUser();
        // Create a bond between the two users
        createValidBond(user1, user1BondAmount, user2, user2BondAmount);
        // Retrieve the bonds between the users
        Bond memory bond1 = c.bond(user1, user2);
        Bond memory bond2 = c.bond(user2, user1);
        // Assert the existence of the bonds
        assertEq(bond1.partner, user2);
        assertEq(bond2.partner, user1);
        // Retrieve contract fee
        uint256 fee = c.withdrawalFee();
        // Retrieve the balance for message sender (user1) before withdrawing
        uint256 amount1 = bond1.amount;
        // Retrieve the balance for partner (user2) before withdrawing
        uint256 amount2 = bond2.amount;
        // Retrieve contract funds
        uint256 contractBalanceBeforeWithdraw = atoken.balanceOf(address(c));
        // Simulate the first user making the call
        vm.prank(user1);
        // Withdraw
        c.withdraw(user2);
        // Retrieve the balance of User1 after withdrawing
        uint256 user1BalanceAfterWithdraw = token.balanceOf(user1);
        assertEq(user1BalanceAfterWithdraw, (amount1 - (amount1 * fee) / 100));
        // Retrieve the balance of User2 after withdrawing
        uint256 user2BalanceAfterWithdraw = token.balanceOf(user2);
        assertEq(user2BalanceAfterWithdraw, (amount2 - (amount2 * fee) / 100));
        // Retrieve the contract balance after withdrawing
        uint256 contractBalanceAfterWithdraw = atoken.balanceOf(address(c));

        // Check for the retained fees after withdrawing
        assertEq(
            ((bond1.amount + bond2.amount) + contractBalanceAfterWithdraw),
            contractBalanceBeforeWithdraw
        );
    }

    // ------------------------------------------------------------------------
    // helper functions
    // ------------------------------------------------------------------------
    function getUser() internal returns (address) {
        userCounter++;
        return
            address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(
                                block.timestamp,
                                block.prevrandao,
                                userCounter
                            )
                        )
                    )
                )
            );
    }

    function createValidBond(
        address user1,
        uint256 amount1,
        address user2,
        uint256 amount2
    ) internal {
        // Set the user's passport score to 30
        passportDecoder.setScore(user1, 30);
        passportDecoder.setScore(user2, 30);
        // Transfer 100 tokens to the user
        token.transfer(user1, amount1);
        token.transfer(user2, amount2);
        // Approve tokens for the first user
        vm.prank(user1);
        token.approve(address(c), amount1);
        // Simulate the first user making the call
        vm.prank(user1);
        // Successfully deposit tokens for the second user
        c.deposit(amount1, user2);

        // Approve tokens for the second user
        vm.prank(user2);
        token.approve(address(c), amount2);
        // Simulate the second user making the call
        vm.prank(user2);
        // Successfully deposit tokens for the first user
        c.deposit(amount2, user1);
    }
}
