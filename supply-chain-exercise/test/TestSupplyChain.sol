pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SupplyChain.sol";

contract TestSupplyChain {
    uint public initialBalance = 1 ether;

    address contractAddress;

    function beforeEach() public {
        contractAddress = DeployedAddresses.SupplyChain();
        SupplyChain supplyChain = SupplyChain(contractAddress);
        supplyChain.addItem("book", 1000);
    }

    // buyItem

    function testBuyWithNotEnoughFunds() public {
        uint sku = 0;
        SupplyChain supplyChain = SupplyChain(contractAddress);
        (bool success, ) = contractAddress.call.value(11000 wei)(abi.encodeWithSelector(supplyChain.buyItem.selector, sku));
        Assert.equal(success, false, "It should be false");
    }

    // test for failure if user does not send enough funds
    // test for purchasing an item that is not for Sale

    // shipItem

    // test for calls that are made by not the seller
    // test for trying to ship an item that is not marked Sold

    // receiveItem

    // test calling the function from an address that is not the buyer
    // test calling the function on an item not marked Shipped

}
