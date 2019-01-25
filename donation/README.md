# Donation

The source for this challenge is
```
pragma solidity ^0.4.21;

contract DonationChallenge {
    struct Donation {
        uint256 timestamp;
        uint256 etherAmount;
    }
    Donation[] public donations;

    address public owner;

    function DonationChallenge() public payable {
        require(msg.value == 1 ether);
        
        owner = msg.sender;
    }
    
    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function donate(uint256 etherAmount) public payable {
        // amount is in ether, but msg.value is in wei
        uint256 scale = 10**18 * 1 ether;
        require(msg.value == etherAmount / scale);

        Donation donation;
        donation.timestamp = now;
        donation.etherAmount = etherAmount;

        donations.push(donation);
    }

    function withdraw() public {
        require(msg.sender == owner);
        
        msg.sender.transfer(address(this).balance);
    }
}
```

The objective of this challenge is to steal all the ether from
the challenge smart contract. The only way to transfer ether
from the instance is by calling the `withdraw` function but
in order to do this we need to be the `owner` of the contract.

The `donate` function has two issues that we can laverage in
order to take control of the smart contract

First there is an issue when converting `ether` to `wei`
```
// amount is in ether, but msg.value is in wei
uint256 scale = 10**18 * 1 ether;
require(msg.value == etherAmount / scale);
```

We know that `1 ether = 10^18 wei` so if the code works
as intended if we set `etherAmount = 1` then `msg.value = 10^18`
but in this case the `etherAmount` is being divide instead of
multiplied. Also the `scale` is wrong because it should be
`10^18` but in this case is `10^36` because `1 ether = 10^18`.
This error means that we can set `etherAmount` to a large value
but we are only going to need to send a small amount of `wei`
to bypass the `require`. For example we can set `etherAmount = 10^36`
and send only `1 wei` and the condition will be `true`.

The second mistake is the way that the `donation` struct is
created here
```
Donation donation;
donation.timestamp = now;
donation.etherAmount = etherAmount;
```

When we create a struct like this `Donation donation;` we are actually
creating a pointer to the storage. This means that by manipulating
this struct we can actually manipulate the storage to our will. In
this case `donatiion.timestamp` points to the first slot of the storage,
where the `donations.length` is stored and `donation.etherAmount` points
to the second slot on the storage, where the `owner` variable is stored.

This means that by sending our address as the `etherAmount` we are going
to get ownership of the contract. The smart contract used to solve this
challenge is [Attack](Attack.sol).

1) Deploy an instance of the [Attack](Attack.sol) smart contract using the
address of the challenge as the constructor parameter and send some ether
when deploying.
2) Call the `hax` function on the [Attack](Attack.sol) instance.
3) Call the `clean` function on the [Attack](Attack.sol) to recover your
`ether`
