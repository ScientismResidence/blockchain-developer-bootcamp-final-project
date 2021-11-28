pragma solidity 0.8.10;

import "./util/Strings.sol";

/// @title Contract for distributing content protected from censorship
/// @author Dmitry Urusov
/// @notice content is stored as Proof of Existence concept
contract Censorshield {
    
    /// @notice Maximum string length for group names
    uint8 public constant GroupNameMaxLength = 32;

    /// @notice Maximum string length for content names
    uint8 public constant ItemNameMaxLength = 128;

    /// @notice Price to change the storage
    /// @dev There should be more advanced way to impact on user intention for storage change
    uint public constant Price = 0.1 ether;
    
    /// @notice Struct that represents group content
    struct Item {
        uint id;
        bytes32 hash;
        string name;
        uint creationDate;
        uint groupId;
        address author;
        bool isAccepted;
    }

    /// @notice Struct that represents content
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
    /// @dev Currently sensless. TODO Implement the proxy contract to be able deploy the updates on existed contract (will be very interesting)
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

    /// @notice Emitted when new group is added
    /// @param groupId group identificator
    /// @param name group name
    /// @param creator creator of the group
    event LogAddGroup(uint indexed groupId, string indexed name, address indexed creator);

    /// @notice Emitted when new content is added to group
    /// @param groupId group identificator to which new content is added
    /// @param itemId content identificator
    /// @param hash hash to check the content existence
    /// @param author creator of the content
    event LogAddItem(uint indexed itemId, uint indexed groupId, bytes32 hash, address author);

    /// @notice Handle the requirement that transaction has enough fund
    modifier paidEnough() { 
        require(msg.value >= Price, "Not enough funds"); 
        _;
    }
    
    /// @notice Handle a case when user send extra funds and refund it back
    modifier refundExcess() {
        _;
        uint amountToRefund = msg.value - Price;
        if (amountToRefund > 0)
            payable(msg.sender).transfer(amountToRefund);
    }

    /// @notice Adds new group and assign the sender as a member of this group.
    /// Setup the rules for changing status of content that belongs to this group.
    /// @param name Unique group name
    /// @param _minimalVotes Minimal votes required to change status of the group content
    /// @param _minimalPercentsToAccept Minimal percents of group members to change the group content status (draft to published)
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

    /// @notice Adds new content to the group
    /// @param groupId Group identification to which the content will belong
    /// @param name Content name
    /// @param _hash Hash of the content to provide Proof of Existence concept for related content that off-chained stored
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

    /// @notice Getter to provide an information about group by its identificator
    /// @param groupId Group identification for desired group
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

    /// @notice Getter to provide a content identificator by index of this content
    /// @param groupId Group identification to which belong the requested content
    /// @param index Index of the content for that group
    function getGroupContentId(uint groupId, uint index)
        public
        view
        returns (uint id)
    {
        id = groupsMap[groupId].content[index];
    }

    /// @notice TODO Allows to vote for a content to move it to published status
    function vote(uint contentId)
        public
    {

    }

    /// @notice TODO Allows to invite a new member to group
    function invite(uint groupId, address newMember)
        public
        payable
        paidEnough
        refundExcess
    {

    }
}