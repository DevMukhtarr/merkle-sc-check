// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop {
    address public owner;
    bytes32 public  merkleRoot;
    IERC20 public tokenAddress;

    mapping (address => bool) public claimed;

    constructor(address _tokenAddress, bytes32 _merkleRoot) {
        owner = msg.sender;
        merkleRoot = _merkleRoot;
        tokenAddress = IERC20(_tokenAddress);
    }   

    modifier onlyOwner () {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function claimReward(
        bytes32[] memory _merkleProof, 
        uint256 _amount
    ) public payable {
        require(claimed[msg.sender], "Can't claim twice");

        bytes32 leafNode = keccak256(abi.encodePacked(msg.sender, _amount));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leafNode), "Invalid merkleproof.");
        
        claimed[msg.sender] = true;

        IERC20(tokenAddress).transferFrom(owner, msg.sender, _amount);
    }
    
    function updateMerkleRoot(bytes32 _newMerkleRoot) external onlyOwner{
        merkleRoot = _newMerkleRoot;
    }

    function withdrawRemainingTokens () external onlyOwner {
        uint256 balance = tokenAddress.balanceOf(address(this));
        require(balance > 0, "Token finished");
        IERC20(tokenAddress).transfer(owner, balance);
    }
}