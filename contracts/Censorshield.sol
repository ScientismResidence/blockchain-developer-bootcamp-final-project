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
        address author;
        bool isAccepted;
    }

    struct Group {
        uint id;
        address creator;
        uint creationDate;
        string name;
        uint32 minimalVotes;
        uint8 minimalPercentsToAccept;
        uint memberCounter;
        mapping(address => bool) membersMap;
        uint contentCounter;
        uint[] content;
    }

    /// @notice Keep the information about contract owner to handle the security
    address public owner = msg.sender;

    /// @notice Mapping of groups ids to group struct.
    /// @dev The reason why this map is internal is solidity limitation
    /// to access to Group.drafts property. Access to this data will be provided by custom getter
    mapping(uint => Group) internal groupsMap;

    /// @notice Mapping of group names hashes and their ids
    mapping(bytes32 => uint) public groupNamesMap;

    /// @notice handling the group ids
    uint public groupCounter;
    
    /// @notice Mapping each member to group ids
    mapping(address => uint[]) public memberGroupsMap;

    /// @notice Mapping each member to groups quantity
    /// @dev Needed to more advanced tracking the groups of member
    mapping(address => uint) public memberGroupsCounterMap;

    /// @notice Mapping of item ids to items;
    mapping(uint => Item) public itemsMap;

    /// @notice Item counter to handle the item ids
    uint public itemCounter;

    event LogAddGroup(uint indexed groupId, string indexed name, address indexed creator);
    event LogAddItem(uint indexed itemId, uint indexed groupId, bytes32 hash, address author);

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
        require (nameBytes.length <= GroupNameMaxLength, "Group name has to be less or equal to 32 characters");

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

    function addItem(uint groupId, string memory name, bytes32 _hash)
        public
        payable
        paidEnough
        refundExcess
    {
        // Check for max length
        bytes memory nameBytes = bytes(name);
        require (nameBytes.length <= ItemNameMaxLength, "Item name has to be less or equal to 128 characters");

        // Check the access to add new item by this sender
        Group storage group = groupsMap[groupId];
        require (group.membersMap[msg.sender] == true, "Sender has to be a member of group");

        // Start to modify the state
        Item storage item = itemsMap[++itemCounter];
        item.id = itemCounter;
        item.hash = _hash;
        item.name = name;
        item.creationDate = block.timestamp;
        item.groupId = group.id;
        item.author = msg.sender;

        group.contentCounter++;
        group.content.push(item.id);

        // Emit event
        emit LogAddItem(item.id, item.groupId, _hash, item.author);
    }

    function getGroup(uint groupId)
        public
        view
        returns (uint size, 
            string memory name,
            address creator,
            uint creationDate,
            uint32 minimalVotes,
            uint8 minimalPercentsToAccept,
            uint memberCounter)
    {
        Group storage group = groupsMap[groupId];
        size = group.contentCounter;
        name = group.name;
        creator = group.creator;
        creationDate = group.creationDate;
        minimalVotes = group.minimalVotes;
        minimalPercentsToAccept = group.minimalPercentsToAccept;
        memberCounter = group.memberCounter;
    }

    function getGroupContentId(uint groupId, uint index)
        public
        view
        returns (uint id)
    {
        id = groupsMap[groupId].content[index];
    }
}