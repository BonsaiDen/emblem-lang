var Node = require('../Node');

Node.Statement('Struct', function(name, members, base) {
    this.name = name; // Identifier
    this.members = members || []; // Array of StructItem
    this.base = base || null; // Identifier

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.name.visit(visitor, this, depth + 1, fromTop);
        this.visitChildren(this.members, visitor, depth, fromTop);
        this.base && this.base.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        // check if base is defined, if so, see if it is another struct
        console.log('Define struct');
        this.scope.defineName(this.name.toString(true), this.getType());
        return this.setType(this.scope.resolveType('struct', this.members));
    },

    toString: function() {
        return '<struct>';
    }

});


