# Token whale

The source for this challenge is
```
pragma solidity ^0.4.21;

contract TokenWhaleChallenge {
    address player;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    string public name = "Simple ERC20 Token";
    string public symbol = "SET";
    uint8 public decimals = 18;

    function TokenWhaleChallenge(address _player) public {
        player = _player;
        totalSupply = 1000;
        balanceOf[player] = 1000;
    }

    function isComplete() public view returns (bool) {
        return balanceOf[player] >= 1000000;
    }

    event Transfer(address indexed from, address indexed to, uint256 value);

    function _transfer(address to, uint256 value) internal {
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;

        emit Transfer(msg.sender, to, value);
    }

    function transfer(address to, uint256 value) public {
        require(balanceOf[msg.sender] >= value);
        require(balanceOf[to] + value >= balanceOf[to]);

        _transfer(to, value);
    }

    event Approval(address indexed owner, address indexed spender, uint256 value);

    function approve(address spender, uint256 value) public {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
    }

    function transferFrom(address from, address to, uint256 value) public {
        require(balanceOf[from] >= value);
        require(balanceOf[to] + value >= balanceOf[to]);
        require(allowance[from][msg.sender] >= value);

        allowance[from][msg.sender] -= value;
        _transfer(to, value);
    }
}
```

We start with `1000` tokens and to win the challenge we need to get
at least `1000000`.

The first thing that I noticed about this smart contract is the flow
of the `transferFrom` function. This function allows someone that was
previously approved to transfer tokens from another account. To do the
trasnfer this function uses the `_transfer` function and the odd thing
is that the `_transfer` function doensn't have a `from` parameter,
instead it transfer the tokens directly from the `msg.sender`. This
means that if the `msg.sender` has `0` tokens and we use the `transferFrom`
function the balance of the `msg.sender` will underflow but in order to
do this we need to do some setup first.

We are going to need 2 accounts. The `player` account and the `aux` account.
The `player` account is the one that needs to meet the condition of having
at least `1000000` tokens. The `aux` account will help us to bypass the 
`transferFrom` required conditions. We need control of both accounts.

First from the `player` account transfer the `1000` tokens to the `aux` account
using the `transfer` function. After this the `player` account will have
`0` tokens meaning that if we call the `_transfer` function the balance will
overflow. Also the `aux` account will have `1000` tokens meaning that calling
the `transferFrom` function with `from = aux` we will be able to bypass
the first `require`.

Now we need to call the `approve` function from the `aux` account and with
`spender = player` and at least `value = 1`. After this we will be able to
bypass the third `require` of the `transferFrom` function.

Now call the `transferFrom` function using the `player` account. Use `from = aux`,
`to = 0x0000000000000000000000000000000000000000` and `value = 1`. Doing this
we will be able to call the `_transfer` function and the balance of the `player`
account will be `2^256 - 1` and the challenge will be solved
