# Emblem

**Emblem** is static language that compiles to JavaScript.

__Emblem Source__

```emblem
    scope {
        int l = 0
        string f

        l = 3 + 3 * 3
        f = 'foo' * 2

        bool o = true == true
        o = 2 != 2 && 'foo' == 'foo'

        string m = 'Hello World'
        int len = #m

        int i = 2
        i += 4
    }
```

__Resulting JavaScript__

```javascript
    {
        var l = 0;
        var f = '';
        l = 3 + 3 * 3;
        f = (new Array(2 + 1).join('foo'));
        var o = true === true;
        o = 2 !== 2 && 'foo' === 'foo';
        var m = 'Hello World';
        var len = m.length;
        var i = 2;
        i = (i + 4);
    }
```

## Development Status

The Project just started, only initial development is done. 

Below's a extremely incomplete listing of done and outstanding tasks.


### Type System

- Primitives

    - bool ✓ 
    - int ✓ 
    - float ✓ 
    - string ✓ 
    - Grammar for Declarations ✓ 

- Operator Overloading

    - Infix Operators and code gen ✓ 
    - Unary Operators and code gen ✓ 
    - Postfix Operators and code gen ✓ 
    - Index Operators and code gen ✓ 
    - Call "Operator" and code gen ✓ 

- Lists

    - Grammar for declarations
    - Grammar for list literals

        - Validation of type unity in list literals

    - Compile time generation item type variants

- Maps

    - Grammar for declarations

    - Grammar for map literals

        - Validation of key/value type unity in map literals

    - Compile time generation of different key/value pair variants

- Properties and Functions on Types

- Structs

    - Basic Structs
    - Struct Inheritcance
    - Default Values

- Functions
    
    - Support for "function" typed variables
    - Support for signature validation
    - Support for closures and compile / run time function generation

- Classes

    - Support of "nullables" (still undecided whether or not to have nullables)
    - Support for "class" typed variables
    - Grammar for Class Statement
    - Grammar for Class Expression
    - Definition of operator overloading


### Others

- Compiler errors show token / source code region of error

- Module System
    
    - Basic import / export for testing ✓ 
    - Fully, correct working import / export system (probably Python alike)

