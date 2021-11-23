pragma solidity 0.8.10;

import "solidity-linked-list/contracts/StructuredLinkedList.sol";

contract Censorshield {
    
    struct Item {
        uint id;
        bytes32 hash;
        string name;
        uint creationDate;
        uint groupId;
        StructuredLinkedList.List drafts;
        uint[] content;
    }

    struct Group {
        uint id;
        address creator;
        uint creationDate;
        string name;
        uint minimalVotes;
        uint8 minimalPercentsToAccept;
        uint memberCounter;
        bytes32[] contents;
        mapping(address => bool) membersMap;
    }

    /// @notice Keep the information about contract owner to handle the security
    address public owner = msg.sender;

    /// @notice Keep an information about account registration
    mapping(address => bool) public enrolledMap;

    /// @notice Mapping of groups ids to group struct.
    mapping(uint => Group) public groupsMap;
    
    /// @notice Mappaing of members for each group
    mapping(uint => address[]) public groupMembersMap;
    
    /// @notice How many members the group has
    mapping(uint => uint) public groupMembersCounterMap;

    /// @notice Mapping of groups for each member;
    mapping(address => uint[]) public memberGroupsMap;

    /// @notice How many groups the member has;
    mapping(address => uint) public memberGroupsCounterMap;

    /// @notice Mapping of draft content to determine the existens of item
    mapping(bytes32 => bool) public draftItemsMap;

    /// @notice Mapping of accepted content to determine the existens of item
    mapping(bytes32 => bool) public acceptedItemsMap;

    //mapping(uint => StructuredLinkedList.List) public test;

    StructuredLinkedList.List public testList;

    event LogTest(bool indexed test);

    function addGroup(string memory name)
        public
        payable
    {
        require(groupsMap)
        // Add new group to groupsMap;
        // Add information for a sender that he a member of a new group
    }

    function addItem(uint groupId)
        public
    {

    }

    function testAddItem(uint item)
        public
    {
        // Check that node doesn't exist in list
        require(StructuredLinkedList.nodeExists(testList, item) == false);

        // Add new node
        bool result = StructuredLinkedList.pushFront(testList, item);

        emit LogTest(result);
    }
}