pragma solidity 0.8.10;

library Strings {
    /// @notice lower latinic symbols for represented string
    /// @param _value string represented in bytes
    /// @return processed bytes
    /// @dev bytes as input/output type is used to avoid string/bytes casting when you process string several times 
    function lower(bytes memory _value)
        internal
        pure
        returns (bytes memory)
    {
        for (uint i = 0; i < _value.length; i++) {
            bytes1 symbol = _value[i];
            if (symbol >= 0x41 && symbol <= 0x5A) {
                _value[i] = bytes1(uint8(symbol) + 32);    
            }
        }
        return _value;
    }

    /// @notice Checks the string bytes to be matched with regex pattern ^([a-z0-9]{1,}|[\s]{1}[a-z0-9]{1,})*$
    /// There are must be lower words/digits with only one space in a row
    /// @param _value string represented in bytes
    /// @return true if it's matched and false vise versa
    /// @dev bytes as input/output type is used to avoid string/bytes casting when you process string several times 
    function areWords(bytes memory _value)
        internal
        pure
        returns (bool) 
    {
        // Keeps the logic to detect two spaces in a row
        uint previousSpace = _value.length + 1;
        for (uint i = 0; i < _value.length; i++) {
            bytes1 symbol = _value[i];
            
            // 0x20 - space
            if (symbol == 0x20) {
                if (previousSpace == i - 1) {
                    return false;
                } else {
                    previousSpace = i;
                }  
            // (0x30 - 0x39) - 0-9 set
            // (0x61 - 0x7A) - a-z set
            // non-optimized
            //if (symbol < 30 || symbol > 39) && (symbol < 0x61 || symbol > 0x7A)) {
            // optimized
            } else if (symbol > 0x7A || symbol < 0x30 || (symbol < 0x61 && symbol > 0x39)) {
                return false;
            }
        }

        return true;
    }
}