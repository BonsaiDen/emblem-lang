

// String ---------------------------------------------------------------------


// Struct ---------------------------------------------------------------------
// TODO struct types need to be constructed with the fields and their respective types...
// we also need to add a hasProperty() method for the . operator so it can look up things at compile time


// Var ------------------------------------------------------------------------


// List -----------------------------------------------------------------------
var list = Type('list');

// TODO auto extend these over when creating sub type lists...
list.defineOperator('+', 'list', 'list', function(a, b) {
    return [].concat(a).concat(b);
});

list.defineOperator('+=', 'list', 'list', function(a, b) {
    return a.push.apply(a, b);
});

// TODO howto implement [] indexing, and slicing!?
// generate on the fly... for the list sub type... need a
// TODO add static helper method for creating list types!!!
list.defineOperator('[]', 'list', 'int', function(a, index) {
    return a[index];
});

list.defineOperator('[:]', 'list', 'list', function(a, from, to) {
    return a.slice(from, to);
});


// Map ------------------------------------------------------------------------
var map = Type('map');

// TODO only classes and structs can implement the . property operator


