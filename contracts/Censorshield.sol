pragma solidity 0.8.10;

contract Censorshield {
    
    enum {
        Draft,
        Recensed
    }
    
    struct Group {
        uint id;
        address creator;
        string name;
        uint minimalApproves;
        uint8 minimalPercentsToApprove;
        uint memberCounter;
        bytes32[] contents;
        mapping(address -> bool) membersMap;
    }

    /// @notice Keep the information about contract owner to handle the security
    address public owner;

    /// @notice Keep an information about account registration
    mapping(address -> bool) public enrolledMap;

    /// @notice Mapping of groups ids to group struct.
    mapping(uint -> Group) public groupsMap;
    
    mapping(uint -> address) public groupMembersMap;
    mapping(address -> uint)

    function enroll()
        public
        payable
    {
        
    }

    function addGroup(string memory name)
        public
        payable
    {
        // Add new group to groupsMap;
        // Add information for a sender that he a member of a new group
    }

    function addItem(uint groupId)
        public
}