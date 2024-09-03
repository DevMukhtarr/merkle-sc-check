// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

contract MerkleAirdrop {
    address public owner;
    bytes32 public  merkleRoot;
    bool claimed;

    constructor(address _erc20_address, bytes32  _merkleRoot) {
         owner = msg.sender;
         merkleRoot = merkleRoot;
    }   

    modifier onlyOwner () {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
}