// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "eas-proxy/IGitcoinPassportDecoder.sol";

interface ITrustBond {
    event FeeUpdated(uint256 newFee);
    event CommunityPoolDeposited(uint256 amount);
    event CommunityPoolWithdrawn(uint256 amount);
    event RewardsWithdrawn(address indexed user, uint256 amount);
    event BondCreated(address indexed partner1, address indexed partner2, uint256 amount);
    event BondBroken(address indexed breaker, address indexed partner, uint256 amount);
    event Paused(bool paused);

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

contract TrustBond is ITrustBond {
    uint256 public constant REQUIRED_SCORE = 20;

    address public _owner;
    bool public _paused;
    uint256 public _fee;
    IGitcoinPassportDecoder public _passportDecoder;

    constructor(address owner, IGitcoinPassportDecoder passportDecoder) {
        _owner = owner;
        _passportDecoder = passportDecoder;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Only owner can call this function");
        _;
    }

    modifier onlyWhenNotPaused() {
        require(!_paused, "Contract is paused");
        _;
    }

    function setFee(uint256 newFee) external onlyOwner {
        _fee = newFee;
        emit FeeUpdated(_fee);
    }

    function pause() external onlyOwner {
        _paused = true;
        emit Paused(_paused);
    }

    function unpause() external onlyOwner {
        _paused = false;
        emit Paused(_paused);
    }

    function isPaused() external view returns (bool) {
        return _paused;
    }

    function depositCommunityPool(uint256 amount) external onlyOwner {
        
    }
    
    function withdrawCommunityPool(uint256 amount) external onlyOwner {

    }

    function withdrawRewardsDistribution(address user) external onlyOwner {

    }

    function deposit(uint256 amount, address partner) external onlyWhenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(msg.sender != partner, "Cannot bond with yourself");
        require(_passportDecoder.getScore(msg.sender) >= REQUIRED_SCORE, "Score must be greater");
        require(_passportDecoder.getScore(partner) >= REQUIRED_SCORE, "Score must be greater");
    }
    
    function withdraw(address partner) external onlyWhenNotPaused {

    }

    function breakBond(address partner) external onlyWhenNotPaused {

    }

    function approve(address partner, address spender) external onlyWhenNotPaused {

    }

    function fee() external view returns (uint256) {
        return _fee;
    }

    function communityPoolBalance() external view returns (uint256) {
        
    }

    function bonds(address user) external view returns (address[] memory) {

    }

    function personMultiplier(address user) external view returns (uint256) {

    }

    function score(address user) external view returns (uint256) {

    }

    function bond(address partner1, address partner2) external view returns (uint256 amount, uint256 createdAt, uint256 lastUpdated) {

    }
}
