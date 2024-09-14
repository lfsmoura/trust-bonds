// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {IPool} from "../src/Contract.sol";

contract AavePoolMock is IPool {
    
    constructor() {
    }

    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external {
        // Mock implementation
    }
}
