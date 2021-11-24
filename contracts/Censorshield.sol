pragma solidity 0.8.10;

import "solidity-linked-list/contracts/StructuredLinkedList.sol";
import "./util/Strings.sol";

contract Censorshield {
    
    uint8 public constant GroupNameMaxLength = 32;
    uint8 public constant ItemNameMaxLength = 128;
    uint public constant Price = 0.1 ether;
    
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
        uint32 minimalVotes;
        uint8 minimalPercentsToAccept;
        uint memberCounter;
        bytes32[] contents;
        mapping(address => bool) membersMap;
    }

    /// @notice Keep the information about contract owner to handle the security
    address public owner = msg.sender;

    /// @notice Mapping of groups ids to group struct.
    mapping(uint => Group) public groupsMap;

    /// @notice Mapping of group names hashes and their ids
    mapping(bytes32 => uint) public groupNamesMap;

    /// @notice handling the group ids
    uint public groupCounter;
    
    /// @notice Mapping each member to groups
    mapping(address => uint[]) public memberGroupsMap;

    /// @notice Mapping each member to groups quantity
    /// @dev Needed to more advanced tracking the groups of member
    mapping(address => uint) public memberGroupsCounterMap;

    //mapping(uint => StructuredLinkedList.List) public test;

    StructuredLinkedList.List public testList;

    event LogAddGroup(uint indexed groupId, string indexed name, address indexed creator);

    modifier paidEnough() { 
        require(msg.value >= Price, "Not enough funds"); 
        _;
    }
    
    modifier refundExcess() {
        _;
        uint amountToRefund = msg.value - Price;
        if (amountToRefund > 0)
            payable(msg.sender).transfer(amountToRefund);
    }

    function addGroup(string memory name, uint32 _minimalVotes, uint8 _minimalPercentsToAccept)
        public
        payable
        paidEnough
        refundExcess
    {
        // Check for max length
        bytes memory nameBytes = bytes(name);
        require (nameBytes.length <= GroupNameMaxLength, "Group name has to be less 32 characters");

        // Check for unacceptable symbols.
        // Name has to contain only [a-z0-9] and only one space in a row
        nameBytes = Strings.lower(nameBytes);
        require (Strings.areWords(nameBytes) == true, "Group name contains unacceptable symbols");

        // Name is unique for a group
        bytes32 nameHash = keccak256(nameBytes);
        require(groupNamesMap[nameHash] == 0, "Such a name already exists");

        // Check the _minimalVotes
        require(_minimalVotes > 0, "Minimal votes must be greater than zero");

        // Check the _minimalPercentsToAccept
        require(_minimalPercentsToAccept <= 100, "Minimal percents to accept must be between 0 and 100");

        // Start to modify the state
        groupNamesMap[nameHash] = ++groupCounter;
        Group storage group = groupsMap[groupCounter];
        group.id = groupCounter; 
        group.creator = msg.sender;
        group.creationDate = block.timestamp;
        group.name = string(nameBytes);
        group.minimalVotes = _minimalVotes;
        group.minimalPercentsToAccept = _minimalPercentsToAccept;
        group.memberCounter = 1;
        group.membersMap[msg.sender] = true;

        uint[] storage memberGroups = memberGroupsMap[msg.sender];
        memberGroups.push(groupCounter);

        memberGroupsCounterMap[msg.sender]++;

        // Emit event
        emit LogAddGroup(groupCounter, group.name, msg.sender);
    }

    function addItem(uint groupId)
        public
    {

    }

    function testAddItem(uint item)
        public
    {
        // Check that node doesn't exist in list
        //require(StructuredLinkedList.nodeExists(testList, item) == false);

        // Add new node
        //bool result = StructuredLinkedList.pushFront(testList, item);

        //emit LogTest(result);
    }
}