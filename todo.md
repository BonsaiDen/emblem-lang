### Milestone 1

- Compile in emblem runtime on demand

### Milestone 2

- String interpolation

### Milestone 3

- Support if / else / elif
- Support try / except / finally
- Support forin

### Milestone 4

- Support properties - somewhat done...
- Support struct types


- in operator: expression in map/list
- enum support
- assignment of empty list / maps
- remove NULL!
- generate overloaded index assignments

- structs / property get / set
- finish import statement code-gen

match e {
    expr {
        
    }

    expr {
        
    } 

    expr {
        
    }
}


no parens in if and other stuff

- var types? need explicit casting everywhere?
    - useful for json?

- "in" operator for hashes and lists?

- string interpolation, things need to be castable to string
- figure out if values / expressions are primitive - mostly done
- make empty lists / maps work in cases where any hash / list is expected

    - need a better find / compare function in TypeDescriptor?

===============================================================================


- string interpolation

- collect user types during compile and generate them out, integrate the type.toString() results into the generated class code
- types are defined on module level
- prevent types from being redefiend or even monkey patched

- how to handle `null` ???

- name {
    isConstant: true,
    value: 'foo'
}

struct[otherStruct, {
    conts int extendedParam
}]

function structCreator(a, b, c, d, e, f) {
    this.a = a;
    this.b = b === undefined ? defaultB : b;
}

- map keys must be castable to strings!!!

- no undefined, used for errors and default params ONLY
- generate try / catch around unsafe code (i.e. code using var, leave out on -O2)

- make array indexable with negative offset [-1] etc.
- detect whether a expression is constant (only primitives are used in it)
- value.isPrimitive() op.isPrimitive() expression.isPrimitive()
    - give all Nodes a isPrimitive() with default return false?

- class expressions

