// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import "eas-proxy/IGitcoinPassportDecoder.sol";

contract GitcoinPassportDecoderMock is IGitcoinPassportDecoder {
    mapping(address => uint256) private scores;

    function setScore(address user, uint256 score) external {
        scores[user] = score;
    }

    function getPassport(address) external pure returns (Credential[] memory) {
        Credential[] memory credentials = new Credential[](0);
        return credentials;
    }

    function getScore(address user) external view returns (uint256) {
        return scores[user];
    }

    function isHuman(address user) external view returns (bool) {
        return scores[user] > 0;
    }
}