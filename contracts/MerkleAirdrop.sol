// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop {
    address public owner;
    bytes32 public  merkleRoot;
    IERC20 public tokenAddress;
    bool claimed;

    constructor(address _tokenAddress, bytes32 _merkleRoot) {
        owner = msg.sender;
        merkleRoot = merkleRoot;
        tokenAddress = IERC20(_tokenAddress);
    }   

    modifier onlyOwner () {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function claimReward() public{

    }
}