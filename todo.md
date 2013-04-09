TODO
- scope / scope chains
- Type to create types dynamically 
    - origin: primtitive, struct, map, list, class, var
    - name 'int', 'MyClass'
    - modifiers? (extern????)

    - way to provide the overloading required
    - implementation of operators so we can check + - [] etc. and later add those to user classes


- string interpolation
- keep indentation of lines based on outer block depth

- collect user types during compile and generate them out, integrate the type.toString() results into the generated class code
- types are defined on module level
- compile single file
- prevent types from being redefiend or even monkey patched

- Type.get('list')
- types are bound to variable names
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

no undefined, used

- make array indexable with negative offset [-1] etc.
- detect whether a expression is constant (only primitives are used in it)
- value.isPrimitive() op.isPrimitive() expression.isPrimitive()
    - give all Nodes a isPrimitive() with default return false?

- class expressions
- review module system / cache modules
- from x import y

