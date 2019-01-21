# Guess the secret number

The source for this challenge is

```
pragma solidity ^0.4.21;

contract GuessTheSecretNumberChallenge {
    bytes32 answerHash = 0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365;

    function GuessTheSecretNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }
    
    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);

        if (keccak256(n) == answerHash) {
            msg.sender.transfer(2 ether);
        }
    }
}
```

To solve this challenge we need to call the
`guess` function with an `uint8` that when
hashed will be equal to the `answerHash`
variable.

Because the number is a `uint8` there are only
`256` posible solutions so we can create an
script that hashes numbers from `0` to `255`
and check if any of those numbers returns the
correct hash. The script used by me can be found
[here](index.js).

The correct answer should be `170` so calling
the `guess` function with this value should
solve the challenge.
