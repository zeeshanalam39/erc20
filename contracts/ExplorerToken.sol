// contracts/ExplorerToken.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ExplorerToken is ERC20Capped {
    address payable public owner;

    constructor(
        uint256 cap,
        uint256 initialSupply
    ) ERC20("ExplorerToken", "ETK") ERC20Capped(cap * (10 ** decimals())) {
        owner = payable(msg.sender);
        _mint(owner, initialSupply * (10 ** decimals()));
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount * (10 ** decimals()));
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        _transfer(owner, to, amount * (10 ** decimals()));
        return true;
    }

    // function _mint(
    //     address account,
    //     uint256 amount
    // ) internal virtual override(ERC20Capped, ERC20) {
    //     require(
    //         ERC20.totalSupply() + (amount * (10 ** decimals())) <= cap(),
    //         "ERC20Capped: cap exceeded"
    //     );
    //     super._mint(account, amount);
    // }

    // function burn(address account, uint256 amount) public virtual onlyOwner {}

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }
}
