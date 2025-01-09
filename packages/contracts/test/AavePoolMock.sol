// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {IPool} from "../src/Contract.sol";
import "./ERC20Mock.sol";

contract AavePoolMock is IPool {
    ERC20 public token;
    ERC20Mock public aToken;

    constructor(address _token) {
        token = ERC20(_token);
        aToken = new ERC20Mock("Aave Interest Bearing Token", "aToken");
    }

    function supply(
        address,
        uint256 amount,
        address onBehalfOf,
        uint16
    ) external {
        token.transferFrom(msg.sender, address(this), amount);
        aToken.transfer(onBehalfOf, amount);
    }

    function withdraw(
        address,
        uint256 amount,
        address to
    ) external returns (uint256) {
        require(
            aToken.balanceOf(msg.sender) >= amount,
            "Insufficient aToken balance"
        );
        aToken.burn(msg.sender, amount);
        token.transfer(to, amount);
        return amount;
    }

    function supplyWithPermit(
        address,
        uint256 amount,
        address onBehalfOf,
        uint16,
        uint256,
        uint8,
        bytes32,
        bytes32
    ) external {
        token.transferFrom(msg.sender, address(this), amount);
        aToken.transfer(onBehalfOf, amount);
    }

    function getAToken() external view returns (address) {
        return address(aToken);
    }
}
