const { items } = require("../supply-chain-exercise/test/ast-helper");

const Censorshield = artifacts.require("Censorshield");

contract("Censorshield", (accounts) => {
    const LogTestEvent = 'LogTest';
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

        it("Test linked list", async() => {
            let result = await instance.testAddItem(1);
            console.log("Result is", result.logs[0].args[0]);
            assert.equal(result.logs[0].event, LogTestEvent, `Should emit ${LogTestEvent} event`);
        });
    });
});