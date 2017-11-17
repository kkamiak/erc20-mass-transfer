pragma solidity ^0.4.11;

/*
    Utilities & Common Modifiers
*/
library SafeMath {

    // Overflow protected math functions

    /**
        @dev returns the sum of _x and _y, asserts if the calculation overflows

        @param _x   value 1
        @param _y   value 2

        @return sum
    */
    function safeAdd(uint _x, uint _y) internal constant returns (uint) {
        uint z = _x + _y;
        assert(z >= _x);
        return z;
    }

    /**
        @dev returns the difference of _x minus _y, asserts if the subtraction results in a negative number

        @param _x   minuend
        @param _y   subtrahend

        @return difference
    */
    function safeSub(uint _x, uint _y) internal constant returns (uint) {
        assert(_x >= _y);
        return _x - _y;
    }

    /**
        @dev returns the product of multiplying _x by _y, asserts if the calculation overflows

        @param _x   factor 1
        @param _y   factor 2

        @return product
    */
    function safeMul(uint _x, uint _y) internal constant returns (uint) {
        uint z = _x * _y;
        assert(_x == 0 || z / _x == _y);
        return z;
    }
}