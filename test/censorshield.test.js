const { catchRevert } = require("./exceptionsHelpers");
const Censorshield = artifacts.require("Censorshield");

contract("Censorshield", (accounts) => {
    const AcceptableName = 'name';
    const AcceptableMinimalVotes = 1;
    const AcceptableMinimalPercentsToAccept = 0;
    const AcceptableTransactionSignature = {from: accounts[0], value: web3.utils.toWei('0.2', 'ether')};

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
            const name = "012345678901234567890123456789 33"
            await catchRevert(instance.addGroup(name, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, 
                AcceptableTransactionSignature), "Group name has to be less 32 characters");
        });

        it("Must failed with unacceptable name", async() => {
            const name = "!abc"
            await catchRevert(instance.addGroup(name, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, 
                AcceptableTransactionSignature), "Group name contains unacceptable symbols");
        });

        it("Must failed with unacceptable minimal votes", async() => {
            await catchRevert(instance.addGroup(AcceptableName, 0, AcceptableMinimalPercentsToAccept, 
                AcceptableTransactionSignature), "Minimal votes must be greater than zero");
        });

        it("Must failed with unacceptable minimal percents to accept", async() => {
            await catchRevert(instance.addGroup(AcceptableName, AcceptableMinimalVotes, 101, 
                AcceptableTransactionSignature), "Minimal percents to accept must be between 0 and 100");
        });

        it("Unable to add two groups with identical names", async() => {
            await instance.addGroup(AcceptableName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            await catchRevert(instance.addGroup(AcceptableName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, 
                AcceptableTransactionSignature), "Such a name already exists");
        });

        it(`Should emit ${LogAddGroupEvent} event`, async() => {
            let result = await instance.addGroup(AcceptableName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            assert.equal(result.logs[0].event, LogAddGroupEvent, `Should emit ${LogAddGroupEvent} event`);
        });

        it("Sender should be a member of group", async() => {
            await instance.addGroup(AcceptableName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            let result = await instance.memberGroupsMap.call(accounts[0], 0);
            assert.equal(result.toNumber(), 1, "Group id is wrong for a member");
        });

        it("Sender should have 1 group", async() => {
            await instance.addGroup(AcceptableName, AcceptableMinimalVotes, AcceptableMinimalPercentsToAccept, AcceptableTransactionSignature);
            let result = await instance.memberGroupsCounterMap.call(accounts[0]);
            assert.equal(result.toNumber(), 1, "Group counter for a member is wrong");
        });
    });
});