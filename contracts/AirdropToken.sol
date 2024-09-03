// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AirdropToken is ERC20 ("Merkle Token", "MTISC") {
    address public owner;
    constructor() payable {
        owner = msg.sender;
        _mint(address(this), 10000e18);
    }

    function mint(uint _amount) external {
        require(msg.sender == owner, "only owner can mint");
        _mint(msg.sender, _amount * 1e18);
    }
}
