## Inheritance and Interfaces

Contract uses string validation functionality that moved to separate library Strings. For this library exists proxy contract to implement tests.

## Proof of Existence

To reduce loading at public storage the dynamicly sized content designed to be off-chained. Instead of storing big size values contract stores keccak hash of the content that used as Proof of Existence concept

## Gas optimizations

To reduce gas usage Strings library has couple of optimizations, such as Short Circuits Rules and usage bytes type instead of string to reduce a quantity of type casting (string to bytes and vise versa)