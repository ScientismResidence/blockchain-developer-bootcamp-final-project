const Storage = artifacts.require("contracts/SimpleStorage.sol");
const Wallet = artifacts.require("contracts/MultiSignatureWalletImplementation.sol");

module.exports = function(callback) {
    (async () => {
        try {
            let storage = await Storage.deployed();
            let wallet = await Wallet.deployed();

            // Display the current state of the storage. It should be default value after migration
            let storageValue = await storage.storedData.call();
            console.log('Current storage value:', storageValue.toString(10));
            
            // Encoded value of calling "set" method of the Storage contract
            let encoded = '0x60fe47b10000000000000000000000000000000000000000000000000000000000000005';

            // Submit this transaction to our Wallet contract to have 1/2 confirmations
            let accounts = await web3.eth.getAccounts();
            let submitResult = await wallet.submitTransaction(storage.address, 0, encoded, {from: accounts[0]});
            console.log('Submit transaction hash:', submitResult.tx);

            // Get the current transaction count in our Wallet contract
            let transactionCount = await wallet.transactionCount.call()
            console.log('Transaction count in Wallet contract:', transactionCount.toString(10));

            // Confirm the last transaction with second account
            // On this point we should have successfull modified our stored value in Storage contract by the Wallet contract
            let confirmResult = await wallet.confirmTransaction(transactionCount - 1, {from: accounts[1]});
            console.log('Confirm transaction hash:', confirmResult.tx);
            
            // Check again the state of the Storage contract
            storageValue = await storage.storedData.call();
            console.log('Current storage value:', storageValue.toString(10));
        }
        catch(error) {
            console.log("Error happened", error);
        }
        finally {
            callback();
        }
    })();
}
