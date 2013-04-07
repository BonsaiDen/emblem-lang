var Node = require('../Node');

Node('Index', function(key) {
    this.key = key;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.key.visit(visitor, this, depth + 1, fromTop);
    },

    getType: function() {
        return this.key.getType();
    },

    toString: function() {
        return '[' + this.key + ']';
    }
});

