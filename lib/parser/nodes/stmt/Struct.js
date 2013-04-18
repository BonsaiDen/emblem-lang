var Node = require('../Node');

Node.Statement('Struct', function(name, members, base) {
    this.name = name; // Identifier
    this.members = members || []; // Array of StructItem
    this.base = base || null; // Identifier

}, {

    getType: function() {
        return this.scope.resolveType('struct', this.members);
    },

    init: function() {
        // check if base is defined, if so, see if it is another struct
        console.log('Define strruct');
        this.scope.defineName(this.name.toString(true), this.getType());
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.name.visit(visitor, this, depth + 1, fromTop);
        this.visitChildren(this.members, visitor, depth, fromTop);
        this.base && this.base.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        return '<struct>';
    }

});

