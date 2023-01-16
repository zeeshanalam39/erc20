// contracts/ExplorerToken.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract ExplorerToken is ERC20Capped {
    address payable public owner;

    constructor(
        uint256 cap,
        uint256 initialSupply
    ) ERC20("ExplorerToken", "ETK") ERC20Capped(cap * (10 ** decimals())) {
        owner = payable(msg.sender);
        _mint(owner, initialSupply * (10 ** decimals()));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
}
