var Node = require('../Node');

Node.Statement('StructItem', function(type, name, defaultValue) {
    this.type = type;
    this.name = name;
    this.def = defaultValue;

}, {

    init: function() {
        // default value must be primitive
    },

    getType: function() {
        // Compare default to type, check if assignable
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.type.visit(visitor, this, depth + 1, fromTop);
        //this.name.visit(visitor, this, depth + 1, fromTop);
        this.def && this.def.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        return '';
    }

});

