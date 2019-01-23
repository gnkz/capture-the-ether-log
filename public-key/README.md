# Public Key

The source for this challenge is

```
pragma solidity ^0.4.21;

contract PublicKeyChallenge {
    address owner = 0x92b28647ae1f3264661f72fb2eb9625a89d88a31;
    bool public isComplete;

    function authenticate(bytes publicKey) public {
        require(address(keccak256(publicKey)) == owner);

        isComplete = true;
    }
}
```

To solve the challenge we need to call the `authenticate` function
with the public key of the `0x92b28647ae1f3264661f72fb2eb9625a89d88a31`
address.

First of all we need to understand that every transaction that is sent
from an EOA has a cryptographic signature that is used to check that
the transaction was sent from a particular ethereum address.

We can browse the transactions that where sent by the 
`0x92b28647ae1f3264661f72fb2eb9625a89d88a31` address using
[Etherscan](https://ropsten.etherscan.io/address/0x92b28647ae1f3264661f72fb2eb9625a89d88a31).
The only out transaction from that account is
[this](https://ropsten.etherscan.io/tx/0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb)
with the transaction hash
`0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb`

Now with the transaction hash we can obtain information about this
transaction using a library like [ethers](https://github.com/ethers-io/ethers.js).
The script used to solve this challenge can be found [here](index.js).

We obtain the transaction signtaure with this code

```javascript
  const txHash = "0xabc467bedd1d17462fcc7942d0af7874d6f8bdefee2b299c9168a216d3ff0edb";

  const tx = await provider.getTransaction(txHash);

  const r = tx.r.slice(2);
  const s = tx.s.slice(2);
  const v = (tx.v - tx.networkId*2 - 8).toString(16);

  const signature = `0x${r}${s}${v}`;

  console.log("Signature:", signature);
```

The signature is
```
a5522718c0f95dde27f0827f55de836342ceda594d20458523dd71a539d52ad7
5710e64311d481764b5ae8ca691b05d14054782c7d489f3511a7abf2f5078962
1b
```

Now using this signature we can recover the public key of the account
that signed the transaction but first we need to know what was the payload
that was signed.

The transaction parameters are
```json
{
  "nonce":    "0x00",
  "gasPrice": "0x3b9aca00",
  "gasLimit": "0x15f90",
  "to":       "0x6B477781b0e68031109f21887e6B5afEAaEB002b",
  "value":    "0x0",
  "data":     "0x5468616e6b732c206d616e21",
  "chainId":  "0x03" 
}
```

Then this parameters need to be serialized using `RLP`. There are some
articles that explain this process [here](https://lsongnotes.wordpress.com/2018/01/14/signing-an-ethereum-transaction-the-hard-way)
and [here](https://medium.com/coinmonks/data-structure-in-ethereum-episode-1-recursive-length-prefix-rlp-encoding-decoding-d1016832f919).

The serialization of the transaction parameters is
```
0xf080843b9aca0083015f90946b477781b0e68031109f21887e6b5afeaaeb002b808c5468616e6b732c206d616e21038080
```

Then these bytes are hashed using the `keccak256` function. The hashing
result is
```
0xd5059040fa47641a3388e7a6795eaaee42a96c6335189dd807075208adcb149a
```

This digest is what is actually signed. So now that we have the message that
was signed we can recover the public key using the signature.

The recovered public key is
```
0x04613a8d23bd34f7e568ef4eb1f68058e77620e40079e88f705dfb258d7a06a1a0364dbe56cab53faf26137bec044efd0b07eec8703ba4a31c588d9d94c35c8db4
```

Notice that this public key has a `04` at the begining. This `04` prefix means that
the public key is uncompressed. You can read more about this
[here](https://davidederosa.com/basic-blockchain-programming/elliptic-curve-keys).

So the actual public key that solves the challenge is
```
0x613a8d23bd34f7e568ef4eb1f68058e77620e40079e88f705dfb258d7a06a1a0364dbe56cab53faf26137bec044efd0b07eec8703ba4a31c588d9d94c35c8db4
```
