# Retirement fund

The source for this challenge is
```
pragma solidity ^0.4.21;

contract RetirementFundChallenge {
    uint256 startBalance;
    address owner = msg.sender;
    address beneficiary;
    uint256 expiration = now + 10 years;

    function RetirementFundChallenge(address player) public payable {
        require(msg.value == 1 ether);

        beneficiary = player;
        startBalance = msg.value;
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function withdraw() public {
        require(msg.sender == owner);

        if (now < expiration) {
            // early withdrawal incurs a 10% penalty
            msg.sender.transfer(address(this).balance * 9 / 10);
        } else {
            msg.sender.transfer(address(this).balance);
        }
    }

    function collectPenalty() public {
        require(msg.sender == beneficiary);

        uint256 withdrawn = startBalance - address(this).balance;

        // an early withdrawal occurred
        require(withdrawn > 0);

        // penalty is what's left
        msg.sender.transfer(address(this).balance);
    }
}
```

In order to solve this challenge we need to empty the contract
balance.

The only way to do this is to call the `collectPenalty` function
because the `withdraw` function can only be called by the contract
owner. The problem with the `collectPenalty` is that it can be called
only if the `owner` called the `withdraw` function before because of

```
uint256 withdrawn = startBalance - address(this).balance;

// an early withdrawal occurred
require(withdrawn > 0);
```

But there is an issue with this code: it is expecting that the 
`startBalance` is always greater than or equal to the contract
balance but this is not always true. We can increase the contract
balance by sending eth to it but sadly it doesn't have a payable
fallback function. Another way to do it is by deploying a smart
contract that calls the `selfdestruct` function.

The `selfdestruct` function accepts an `address` as a parameter
and it sends all the balance from the contract to that address
even if the target smart contract doesn't have a payable fallback
function.

The contract used to solve this challenge is [Kamikaze](Kamikaze.sol).
Simply deploy the [Kamikaze](Kamikaze.sol) with the challenge
`address` as a parameter and send along some `wei`. Then call
the `attack` function to force send the balance to the challenge.

Now if you call the `collectPenalty` function on the challenge
contract the `withdrawn` function will underflow because
`contract.balance > startBalance` and the condition of
`withdrawn > 0` will be true and you will receive all the `ether`.
