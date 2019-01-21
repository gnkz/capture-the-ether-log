# Guess the random number

The source for this challenge is

```
pragma solidity ^0.4.21;

contract GuessTheRandomNumberChallenge {
    uint8 answer;

    function GuessTheRandomNumberChallenge() public payable {
        require(msg.value == 1 ether);
        answer = uint8(keccak256(block.blockhash(block.number - 1), now));
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);

        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
```

To solve this challenge we need to call the `guess` function
with the correct answer. The `answer` variable is set when
the contract is created and is not public so we can't read
this variable directly from the contract. Ethereum is a public
blockchain meaning that even if a solidity variable is not
public we can still read it from the contract storage. To
do this we can use a library like [web3](https://github.com/ethereum/web3.js/)
or [ethers](https://github.com/ethers-io/ethers.js).

The script used to solve this challenge can be found
[here](index.js). Using this script to get the storage
at `0x00` results in

```
0x00000000000000000000000000000000000000000000000000000000000000a4
```

This is a `uint8` so the correct answer is `0xa4` and calling
the `guess` function with this number as a parameter should
solve the challenge.
