//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

contract TestToken {
    //uint256 can over/underflow, so SafeMath prevents fuckups
    //Usings at top
    using SafeMath for uint256;

    //Public can be access from outside the contract
    //View is constant
    //Events can trigger external applications
    string public constant name = 'TestToken';
    string public constant symbol = 'TTN';
    address public DeployerAddress;
    uint8 public constant decimals = 18;

    //Define Approval event with owner address, delegate address and amount of tokens the delegate can spend
    event Approval(address indexed tokenOwner, address indexed spender, uint256 tokens);

    //Define transfer event with from address, to address and amount of tokens
    event Transfer(address indexed from, address indexed to, uint256 tokens);

    //Define balances dict/hashmap/thing with address as the key and uint256 as a value
    mapping(address => uint256) balances;

    //Define allowed dict/hashmap/thing with address as the key and address:uint256 hashmap as a value
    mapping(address => mapping(address => uint256)) allowed;

    uint256 totalSupply_;

    constructor(uint256 total) {
        //Total being total number of tokens - is passed as parameter on deployment
        totalSupply_ = total;
        //msg.sender being the address of the wallet interacting with it
        //Gives all tokens to wallet that deploys contract
        balances[msg.sender] = totalSupply_;
        DeployerAddress = msg.sender;
    }

    function totalSupply() public view returns (uint256) {
        //Public function to return totalSupply_
        return totalSupply_;
    }

    function balanceOf(address tokenOwner) public view returns (uint256) {
        //Public function to return the amount of tokens a wallet has in balances dict
        return balances[tokenOwner];
    }

    function mint(uint256 numTokens) public returns (bool) {
        require(msg.sender == DeployerAddress);

        //SafeMath uses .sub instead of subtraction operator because safer. Same for add.
        balances[msg.sender] = balances[msg.sender].add(numTokens);

        totalSupply_ = totalSupply_.add(numTokens);

        //Emits an event for Transfer with three params
        emit Transfer(address(0), msg.sender, numTokens);

        return true;
    }

    function transfer(address receiver, uint256 numTokens) public returns (bool) {
        //Acts as a break if wallet balance is less than numTokens - reverts previous logic if fails as well
        require(numTokens <= balances[msg.sender]);

        //SafeMath uses .sub instead of subtraction operator because safer. Same for add.
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);

        //Emits an event for Transfer with three params
        emit Transfer(msg.sender, receiver, numTokens);

        return true;
    }

    function approve(address delegate, uint256 numTokens) public returns (bool) {
        //Delegate is a 3rd party allowed to spend tokens for a wallet

        //mapping(address => mapping(address => uint256))
        //[owner[delegate:spendable tokens]]
        allowed[msg.sender][delegate] = numTokens;

        //Emits an event for Approval with three params
        Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function allowance(address owner, address delegate) public view returns (uint256) {
        //Returns value for how much a delegate can spend on behalf of an address
        return allowed[owner][delegate];
    }

    function transferFrom(
        address owner,
        address buyer,
        uint256 numTokens
    ) public returns (bool) {
        //Require token owner to have the amount of tokens needed
        //Require delegate for owner to be allowed to use the amount of tokens needed
        require(numTokens <= balances[owner]);
        require(numTokens <= allowed[owner][msg.sender]);

        //Remove set amount of tokens from owner's balance
        balances[owner] = balances[owner].sub(numTokens);

        //Remove set amount of allowed tokens from delegate
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(numTokens);

        //Gives buyer the set amount of tokens
        balances[buyer] = balances[buyer].add(numTokens);

        //Emits an event for Transfer with three params
        Transfer(owner, buyer, numTokens);
        return true;
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
