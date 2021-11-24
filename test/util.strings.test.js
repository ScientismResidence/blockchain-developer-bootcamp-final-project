const StringsTest = artifacts.require("StringsTest");

contract("StringsTest", (accounts) => {
    
    const AlphabetUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const AlphabetLower = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const AcceptableSymbols = 'abcdefghijklmnopq rstuvwxyz 0123456789';
    const TwoSpacesInRow = 'a  b';
    const UnacceptableSymbolsSeries1 = 'AZ';
    const UnacceptableSymbolsSeries2 = '/:';
    const UnacceptableSymbolsSeries3 = '`{';
    
    beforeEach(async () => {
        instance = await StringsTest.new();
    });

    describe("lower() function tests", () => {
        it("Should properly lower any latin upper character", async () => {
            let paramHex = web3.utils.utf8ToHex(AlphabetUpper);
            let resultHex = await instance.lower(paramHex);
            let result = web3.utils.hexToUtf8(resultHex);
            assert.equal(result, AlphabetLower, "Something goes wrong")
        });
    });

    describe("areWords() function test", () => {
        it("Should pass with acceptable symbols", async () => {
            let paramHex = web3.utils.utf8ToHex(AcceptableSymbols);
            let result = await instance.areWords(paramHex);
            assert.equal(result, true, "Acceptable symbols haven't been passed")
        });

        it("Shouldn't pass with two spaces in row", async () => {
            let paramHex = web3.utils.utf8ToHex(TwoSpacesInRow);
            let result = await instance.areWords(paramHex);
            assert.equal(result, false, "Two spaces in row have been passed")
        });

        it("Shouldn't pass with unacceptable symbols series 1", async () => {
            let paramHex = web3.utils.utf8ToHex(UnacceptableSymbolsSeries1);
            let result = await instance.areWords(paramHex);
            assert.equal(result, false, "Unacceptable symbols have been passed")
        });

        it("Shouldn't pass with unacceptable symbols series 2", async () => {
            let paramHex = web3.utils.utf8ToHex(UnacceptableSymbolsSeries2);
            let result = await instance.areWords(paramHex);
            assert.equal(result, false, "Unacceptable symbols have been passed")
        });

        it("Shouldn't pass with unacceptable symbols series 3", async () => {
            let paramHex = web3.utils.utf8ToHex(UnacceptableSymbolsSeries3);
            let result = await instance.areWords(paramHex);
            assert.equal(result, false, "Unacceptable symbols have been passed")
        });
    });
});