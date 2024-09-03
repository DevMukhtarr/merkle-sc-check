// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AirdropToken is ERC20 ("Merkle Token", "MT") {
    constructor() payable {
        _mint(msg.sender, 10000e18);
    }
}
