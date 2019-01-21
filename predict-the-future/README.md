# Predict the future

The source for this challenge is
```
pragma solidity ^0.4.21;

contract PredictTheFutureChallenge {
    address guesser;
    uint8 guess;
    uint256 settlementBlockNumber;

    function PredictTheFutureChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(uint8 n) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = n;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
```

The objective of this challenge is to call the `settle`
function and guess a number in the range `[0, 9]`. The
difficulty of this challenge comes with how we guess the
number. First we need to call the `lockInGuess` function
with our guess. Then, in another block we need to call
the `settle` function where the correct answer is generated
and compared with our `guess`. The sad thing is that the
answerd depends on the `block.number` and the `now` variables
and if we fail we are going to need to call the `lockInGuess`
function again and stake another `ether`.

To solve this challenge we can create a contract that get
the correct answer before calling the `settle` function in
order to be sure that we are not going to fail. The contract
use by me to solve this challenge is [Guesser](Guesser.sol).

Steps to solve the challenge

1) Deploy a [Guesser](Guesser.sol) contract with the challenge
address and your guess (a number between 0 and 9) as parameters.
2) Call the `lock` function on the [Guesser](Guesser.sol).
3) Call the `guess` function. If you use remix it will tell
you if the transaction will fail because of the
`require(answer == predict())`
4) If remix doesn't alert you that the transaction will fail
and the transaction fail anyway just keep trying. It took me
more than 25 transactions to solve the challenge. I was tired
of clicking the metamask prompts and because of that I created
a [script](index.js) to automatize the process.
5) Call the `clear` function to retrieve your ether.
