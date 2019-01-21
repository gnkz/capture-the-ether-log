# Guess the new number

The source for this challenge is

```
pragma solidity ^0.4.21;

contract GuessTheNewNumberChallenge {
    function GuessTheNewNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
```

To solve this challenge we need to call the `guess` function
with a number that is equal to the `answer` variable.
This time this variable is not stored on the storage and is
calculated only when we call the `guess` function. In order to
get the correct answer we need to know the values of
`block.blockhash(block.number - 1)` and `now`. The trick is that
these variables are the same for all the transactions on a block
so we can create a contract that calculates the answer and then
call the `guess` function with this answer.

The contract used to solve this challenge is [Solver](Solver.sol).
It has a `payable` `fallback` function in order to receive `ether`
from the `GuessTheNewNumberChallenge` contract and a function that
destroys the contract and send the balance to the `owner` to retrieve
all the `ether`.

To solve this challenge

1) Deploy the [Solver](Solver.sol) contract with the address of the
challenge as a parameter and with `1 ether` as the `value`.
2) Call the `solve` function.
3) Call the `clear` function to recover the `ether`.
