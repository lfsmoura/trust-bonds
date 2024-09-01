// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

interface ITrustBond {
    event FeeUpdated(uint256 newFee);
    event CommunityPoolDeposited(uint256 amount);
    event CommunityPoolWithdrawn(uint256 amount);
    event RewardsWithdrawn(address indexed user, uint256 amount);
    event BondCreated(address indexed partner1, address indexed partner2, uint256 amount);
    event BondBroken(address indexed breaker, address indexed partner, uint256 amount);

    // security measure
    function pause() external;
    function unpause() external;
    function isPaused() external view returns (bool);

    // owner only
    function setFee(uint256 fee) external;
    function withdrawCommunityPool(uint256 amount) external;

    function depositCommunityPool(uint256 amount) external;
    function withdrawRewardsDistribution(address user) external;

    function deposit(uint256 amount, address partner) external;
    function withdraw(address partner) external;
    function breakBond(address partner) external;
    function approve(address partner, address spender) external;

    function fee() external view returns (uint256);
    function communityPoolBalance() external view returns (uint256);
    function bond(address partner1, address partner2) external view returns (uint256 amount, uint256 createdAt, uint256 lastUpdated);
    function bonds(address user) external view returns (address[] memory);
    function personMultiplier(address user) external view returns (uint256);
    function score(address user) external view returns (uint256);
}

contract TrustBond {

 }
