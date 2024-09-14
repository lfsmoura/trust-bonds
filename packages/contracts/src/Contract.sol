// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "eas-proxy/IGitcoinPassportDecoder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
}

struct Bond {
    address partner;
    uint256 amount;
    uint256 createdAt;
    uint256 lastUpdated;
}

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
    function bond(address partner1, address partner2) external view returns (Bond memory);
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

    // TODO: there's also L2Pool, should we use that?
    IPool public _pool;
    IERC20 public _token;

    // TODO: inefficient, but it's fine for now
    mapping(address => Bond[]) public _bonds;

    constructor(address owner, IGitcoinPassportDecoder passportDecoder, IPool pool, IERC20 token) {
        _owner = owner;
        _passportDecoder = passportDecoder;
        _pool = pool;
        _token = token;
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
        require (_token.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(msg.sender != partner, "Cannot bond with yourself");
        require(_passportDecoder.getScore(msg.sender) >= REQUIRED_SCORE, "Score must be greater");
        require(_passportDecoder.getScore(partner) >= REQUIRED_SCORE, "Score must be greater");

        // TODO: what is a referral code?
        // TODO: I am assuming a single deposit for each bond
        _pool.supply(address(_token), amount, address(this), 0);

        Bond memory createdBond = bond(msg.sender, partner);
        if (createdBond.partner == address(0)) {
            _bonds[msg.sender].push(Bond(partner, amount, block.timestamp, block.timestamp));
        } else {
            createdBond.amount += amount;
            createdBond.lastUpdated = block.timestamp;
        }
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

    function bond(address partner1, address partner2) public view returns (Bond memory) {
        for (uint256 i = 0; i < _bonds[partner1].length; i++) {
            if (_bonds[partner1][i].partner == partner2) {
                return _bonds[partner1][i];
            }
        }
        return Bond(address(0), 0, 0, 0);
    }
}
