const { catchRevert } = require("./exceptionsHelpers");
const Censorshield = artifacts.require("Censorshield");

contract("Censorshield", (accounts) => {
    const AcceptableGroupName = 'Group Name';
    const AcceptableItemName = 'Item Name';
    const AcceptableMinimalVotes = 1;
    const AcceptableMinimalPercentsToAccept = 0;
    const AcceptableTransactionSignature = {from: accounts[0], value: web3.utils.toWei('0.2', 'ether')};
    const NotAMemberTransactionSignature = {from: accounts[1], value: web3.utils.toWei('0.2', 'ether')};
    const NotEnoughFundsTransactionSignature = {from: accounts[0], value: web3.utils.toWei('0.09', 'ether')};

    const Item1Hash = web3.utils.keccak256("Your contracts can fire events that you can catch to gain more insight into what your contracts are doing.");

    const LogAddGroupEvent = 'LogAddGroup';

    console.log("Used accounts", accounts);

    beforeEach(async () => {
        instance = await Censorshield.new();
    });

    describe("Creation", () => {
        it("Should have a proper owner", async () => {
            let result = await instance.owner();
            console.log("Owner is", result);
            assert.equal(accounts[0], result, "Contract should have a proper owner")
        });
    });

    describe("AddGroup", () => {
        it("Must failed with long group name", async() => {
            // 33 symbols
            const name = "012345678901234567890123456789 33"
            await catchRevert(instance.addGroup(name, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, 
                AcceptableTransactionSignature), "Group name has to be less or equal to 32 characters");
        });

        it("Must failed with unacceptable name", async() => {
            const name = "!abc"
            await catchRevert(instance.addGroup(name, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, 
                AcceptableTransactionSignature), "Group name contains unacceptable symbols");
        });

        it("Must failed with unacceptable minimal votes", async() => {
            await catchRevert(instance.addGroup(AcceptableGroupName, 0, AcceptableMinimalPercentsToAccept, 
                AcceptableTransactionSignature), "Minimal votes must be greater than zero");
        });

        it("Must failed with unacceptable minimal percents to accept", async() => {
            await catchRevert(instance.addGroup(AcceptableGroupName, AcceptableMinimalVotes, 101, 
                AcceptableTransactionSignature), "Minimal percents to accept must be between 0 and 100");
        });

        it("Must failed with not enough funds", async() => {
            await catchRevert(instance.addGroup(AcceptableGroupName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, 
                NotEnoughFundsTransactionSignature), "Not enough funds");
        });

        it("Unable to add two groups with identical names", async() => {
            await instance.addGroup(AcceptableGroupName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            await catchRevert(instance.addGroup(AcceptableGroupName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, 
                AcceptableTransactionSignature), "Such a name already exists");
        });

        it(`Should emit ${LogAddGroupEvent} event`, async() => {
            let result = await instance.addGroup(AcceptableGroupName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            assert.equal(result.logs[0].event, LogAddGroupEvent, `Should emit ${LogAddGroupEvent} event`);
        });

        it("Sender should be a member of group", async() => {
            await instance.addGroup(AcceptableGroupName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            let result = await instance.memberGroupsMap.call(accounts[0], 0);
            assert.equal(result.toNumber(), 1, "Group id is wrong for a member");
        });

        it("Sender should have 1 group", async() => {
            await instance.addGroup(AcceptableGroupName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            let result = await instance.memberGroupsCounterMap.call(accounts[0]);
            assert.equal(result.toNumber(), 1, "Group counter for a member is wrong");
        });
    });

    describe("AddItem", () => {
        it("Must failed with long item name", async() => {
            let result = await instance.addGroup(AcceptableGroupName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            const groupId = result.logs[0].args.groupId.toNumber();
            // 130 symbols
            const name = "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789"
            await catchRevert(instance.addItem(groupId, name, Item1Hash, AcceptableTransactionSignature), "Item name has to be less or equal to 128 characters");
        });

        it("Must failed when you are not a group member", async() => {
            let result = await instance.addGroup(AcceptableGroupName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            const groupId = result.logs[0].args.groupId.toNumber();
            await catchRevert(instance.addItem(groupId, AcceptableItemName, Item1Hash, NotAMemberTransactionSignature), "Sender has to be a member of group");
        });

        it("Must failed with not enough funds", async() => {
            let result = await instance.addGroup(AcceptableGroupName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            const groupId = result.logs[0].args.groupId.toNumber();
            await catchRevert(instance.addItem(groupId, AcceptableItemName, Item1Hash, NotEnoughFundsTransactionSignature), "Not enough funds");
        });

        it("Content should be presented in drafts of proper group", async() => {
            let result = await instance.addGroup(AcceptableGroupName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            const groupId = result.logs[0].args.groupId.toNumber();
            await instance.addItem(groupId, AcceptableItemName, Item1Hash, AcceptableTransactionSignature);
            const {size, name} = await instance.getGroup(groupId);
            assert.equal(1, size.toNumber(), "Drafts is emtpy after adding content to the group");
        });
    });
});