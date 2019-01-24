# Mapping

The source for this challenge is
```
pragma solidity ^0.4.21;

contract MappingChallenge {
    bool public isComplete;
    uint256[] map;

    function set(uint256 key, uint256 value) public {
        // Expand dynamic array as needed
        if (map.length <= key) {
            map.length = key + 1;
        }

        map[key] = value;
    }

    function get(uint256 key) public view returns (uint256) {
        return map[key];
    }
}
```

To solve this challenge we need to set the `isComplete`
variable to `true`.

We need to understand how dynamic ararys are stored on
the storage. A really good article about this topic can
be found [here](https://programtheblockchain.com/posts/2018/03/09/understanding-ethereum-smart-contract-storage).

A smart contract storage have `2^256 - 1` slots. Each slot
can hold up to `32 bytes`. Storage variables are stored
consecutively starting from the position `0` (Multiple
variables can be stored in one slot if their type length
is less than `32 bytes`). If a variable is a dynamic array
only the current length of the array is stored following
the previous rules. So in this case the storage looks like
this

```
0: 0000000000000000000000000000000000000000000000000000000000000000 // isComplete
1: 0000000000000000000000000000000000000000000000000000000000000000 // map.length
...
```

If we insert an element to the `map` array the length will
be modified and the actual element will be stored on the
position

```
keccak256(uint256(arrayLengthPosition)) + elementIndex
```

Lets say that the first element is stored at the position
```
0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFD
```

The second one will be stored at
```
0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE
```

The third one will be stored at
```
0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
```

And if we store one more it will be stored at
```
0x0000000000000000000000000000000000000000000000000000000000000000
```

Because the storage only have `2^256 - 1` slots. This means that
we can start to override the storage if we know the index of the
array where it overflows.

A smart contract that can do this is [Attack](Attack.sol). Deploy
it using the challenge address and the position of where the length
of the array is stored. In this case is `1`.

Then call the `set(0, 1)` function on the [Attack](Attack.sol) instance.
This will write a `1` on the position `0` of the storage overriding
the `isComplete` variable and set it to `true`.

