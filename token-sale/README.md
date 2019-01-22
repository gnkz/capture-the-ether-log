# Token sale

The source for this challenge is

```
pragma solidity ^0.4.21;

contract TokenSaleChallenge {
    mapping(address => uint256) public balanceOf;
    uint256 constant PRICE_PER_TOKEN = 1 ether;

    function TokenSaleChallenge(address _player) public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance < 1 ether;
    }

    function buy(uint256 numTokens) public payable {
        require(msg.value == numTokens * PRICE_PER_TOKEN);

        balanceOf[msg.sender] += numTokens;
    }

    function sell(uint256 numTokens) public {
        require(balanceOf[msg.sender] >= numTokens);

        balanceOf[msg.sender] -= numTokens;
        msg.sender.transfer(numTokens * PRICE_PER_TOKEN);
    }
}
```

To solve this challenge we need to steal `ether` from the
contract to meet the condition `contract.balance < 1 ether`.

Reading the `TokenSaleChallenge` contract I noticed that
this part of the `buy` function is not checking for
overflows

```
require(msg.value == numTokens * PRICE_PER_TOKEN)
```

This means that we can set `numTokens` as a number
that will overflow the `numTokens * PRICE_PER_TOKEN` expression.
This means that the `msg.value` will be a lower number because
of the overflow.

The way I did this was by using a smart contract that did
all the calculations. The smart contract is
[TokenSaleAttack](TokenSaleAttack.sol) and the assembly code
was taken from [this article](https://medium.com/wicketh/mathemagic-512-bit-division-in-solidity-afa55870a65).

To solve this challenge

1) Deploy an instance of the [TokenSaleAttack](TokenSaleAttack.sol)
smart contract with the address of the challenge as a parameter.
2) Call the `attack` function.
3) Call the `clean` function to retrieve the ether.
