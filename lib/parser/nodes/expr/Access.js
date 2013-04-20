var Node = require('../Node');

Node('Access', function(property) {
    this.property = property;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.property.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        return true;
    },

    toString: function() {
        return '.' + this.property;
    }

});

