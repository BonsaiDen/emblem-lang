var Node = require('../../Node');

Node.Statement('StructItem', function(type, name, defaultValue) {
    this.type = type;
    this.name = name;
    this.def = defaultValue;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.type.visit(visitor, this, depth + 1, fromTop);
        //this.name.visit(visitor, this, depth + 1, fromTop);
        this.def && this.def.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        // default value must be primitive
        return true;
    },

    getType: function() {
        // Compare default to type, check if assignable
    },

    toString: function() {
        return '<struct item>';
    }

});

