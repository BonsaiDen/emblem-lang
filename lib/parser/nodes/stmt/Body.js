var Node = require('../Node');

Node.Statement('Body', function(line) {
    this.lines = line ? [line] : [];

}, {

    // Custom -----------------------------------------------------------------
    addLine: function(line) {
        this.lines.push(line);
    },

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

