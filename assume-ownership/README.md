# Assume ownership

The source for this challenge is
```
pragma solidity ^0.4.21;

contract AssumeOwnershipChallenge {
    address owner;
    bool public isComplete;

    function AssumeOwmershipChallenge() public {
        owner = msg.sender;
    }

    function authenticate() public {
        require(msg.sender == owner);

        isComplete = true;
    }
}
```

To solve the challenge we need to call the `authenticate`
function to change the `isComplete` variable to `true` but
first we need to take ownership of the contract by changing
the `owner` variable.

It may be hard to notice but there is a typo on the constructor
definition. In `solidity < 0.5.0` we can define a constructor
by creating a function with the same name as the contract.
In this case the smart contract is called `AssumeOwnershipChallenge`
but the constructor is called `AssumeOwmershipChallenge`. This
is a big mistake because now the `AssumeOwmershipChallenge` is
just a function and can be called by anyone changing the `owner`
variable.

To solve this challenge simply call the `AssumeOwmershipChallenge`
function and then call `authenticate`.
