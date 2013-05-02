var Node = require('../Node');

Node.Statement('Body', function(lines) {
    this.lines = lines || [];

}, {

    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.lines, visitor, depth, fromTop);
    },

    init: function() {
        return true;
    },

    toString: function() {
        return this.toLineBlock(1, this.lines);
    }

});

