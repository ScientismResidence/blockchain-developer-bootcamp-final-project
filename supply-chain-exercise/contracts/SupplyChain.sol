// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16 <0.9.0;

contract SupplyChain {

  address public owner = msg.sender;
  uint public skuCount;
  Item[] public items;

  enum State { ForSale, Sold, Shipped, Received }

  struct Item {
    string name;
    uint sku;
    uint price;
    State state;
    address payable seller;
    address payable buyer;
  }

  event LogForSale(uint indexed sku);
  event LogSold(uint indexed sku);
  event LogShipped(uint indexed sku);
  event LogReceived(uint indexed sku);

  // Create a modifer, `isOwner` that checks if the msg.sender is the owner of the contract
  modifier isOwner() {
    require(msg.sender == owner);
    _;
  }

  modifier verifyCaller (address _address) { 
    require (msg.sender == _address); 
    _;
  }

  modifier paidEnough(uint _sku) { 
    require(msg.value >= items[_sku].price); 
    _;
  }

  modifier refundExcess(uint _sku) {
    _;
    uint _price = items[_sku].price;
    uint amountToRefund = msg.value - _price;
    if (amountToRefund > 0)
      items[_sku].buyer.transfer(amountToRefund);
  }

  // For each of the following modifiers, use what you learned about modifiers
  // to give them functionality. For example, the forSale modifier should
  // require that the item with the given sku has the state ForSale. Note that
  // the uninitialized Item.State is 0, which is also the index of the ForSale
  // value, so checking that Item.State == ForSale is not sufficient to check
  // that an Item is for sale. Hint: What item properties will be non-zero when
  // an Item has been added?

  // modifier forSale
  /// @dev Related to the comment above I don't see the problem with default value of the state.
  /// Each item is added to the array is for sale by default and then state can be changed.
  /// If the state wasn't changed by some reason in later flow it's not a modifier problem.
  /// I mean the state property must reflect the state. So, because of it I don't care about default value.
  /// So, please, give me to know if I something messed up.
  /// @notice I also changed structure of the modifier to have one instead group of them
  modifier hasState(uint _sku, State requiredState) {
    require(items[_sku].state == requiredState);
    _;
  } 

  constructor() public {

  }

  // 1. Create a new item and put in array
  // 2. Increment the skuCount by one
  // 3. Emit the appropriate event
  // 4. return true
  function addItem(string memory _name, uint _price) 
    public 
    returns (bool) 
  {
    
    items.push(Item({
      name: _name, 
      sku: skuCount++, 
      price: _price, 
      state: State.ForSale, 
      seller: msg.sender, 
      buyer: address(0)
    }));
    
    emit LogForSale(skuCount);
    
    return true;
  }

  // Implement this buyItem function. 
  // 1. it should be payable in order to receive refunds
  // 2. this should transfer money to the seller, 
  // 3. set the buyer as the person who called this transaction, 
  // 4. set the state to Sold. 
  // 5. this function should use 3 modifiers to check 
  //    - if the item is for sale, 
  //    - if the buyer paid enough, 
  //    - check the value after the function is called to make 
  //      sure the buyer is refunded any excess ether sent. 
  // 6. call the event associated with this function!
  function buyItem(uint sku) 
    public
    payable
    hasState(sku, State.ForSale) 
    paidEnough(sku)
    refundExcess(sku)
  {
    items[sku].buyer = msg.sender;
    items[sku].state = State.Sold;
    items[sku].seller.transfer(items[sku].price);

    emit LogSold(sku);
  }

  // 1. Add modifiers to check:
  //    - the item is sold already 
  //    - the person calling this function is the seller. 
  // 2. Change the state of the item to shipped. 
  // 3. call the event associated with this function!
  function shipItem(uint sku) 
    public
    hasState(sku, State.Sold)
    verifyCaller(items[sku].seller)
  {
    items[sku].state = State.Shipped;

    emit LogShipped(sku);
  }

  // 1. Add modifiers to check 
  //    - the item is shipped already 
  //    - the person calling this function is the buyer. 
  // 2. Change the state of the item to received. 
  // 3. Call the event associated with this function!
  function receiveItem(uint sku) 
    public
    hasState(sku, State.Shipped)
    verifyCaller(items[sku].buyer)
  {
    items[sku].state = State.Received;

    emit LogReceived(sku);
  }

  // Allows to get an information about item
  function fetchItem(uint _sku) 
    public 
    view
    returns (string memory name, uint sku, uint price, uint state, address seller, address buyer)
  { 
     name = items[_sku].name; 
     sku = items[_sku].sku; 
     price = items[_sku].price; 
     state = uint(items[_sku].state); 
     seller = items[_sku].seller; 
     buyer = items[_sku].buyer;
     return (name, sku, price, state, seller, buyer);
  }
}
