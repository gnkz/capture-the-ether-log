# Guess the number

The source for this challenge is

```
pragma solidity ^0.4.21;

contract GuessTheNumberChallenge {
    uint8 answer = 42;

    function GuessTheNumberChallenge() public payable {
        require(msg.value == 1 ether);
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

To solve this challenge we need to call the
`guess` function with the right answer.

Luckly for us the `answer` variable value
is set on the source code so calling the
`guess` function with `42` as the parameter
will solve the challenge.
