//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

contract Presale {
    //uint256 can over/underflow, so SafeMath prevents fuckups
    //Usings at top
    using SafeMath for uint256;

    //Public can be access from outside the contract
    //View is constant
    //Events can trigger external applications
    address public contractAddress;
    uint8 public constant MAXSALE = 100;
    address public deployerAddress;

    //Define Approval event with owner address, delegate address and amount of tokens the delegate can spend
    event Approval(address indexed tokenOwner, address indexed spender, uint256 tokens);

    //Define transfer event with from address, to address and amount of tokens
    event Transfer(address indexed from, address indexed to, uint256 tokens);

    constructor(uint256 total) {

    }

    function totalSupply() public view returns (uint256) {
        //Public function to return totalSupply_
        return totalSupply_;
    }

    receive() external payable {
        // custom function code
    }
}

library SafeMath {
    //SafeMath library to prevent math fuckups
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}
