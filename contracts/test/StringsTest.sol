pragma solidity 0.8.10;

import "../util/Strings.sol";

contract StringsTest {
    function lower(bytes memory _value)
        public
        pure
        returns (bytes memory)
    {
        return Strings.lower(_value);
    }

    function areWords(bytes memory _value)
        public
        pure
        returns (bool)
    {
        return Strings.areWords(_value);
    }
}