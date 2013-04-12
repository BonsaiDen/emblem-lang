var Node = require('../Node');

Node.Statement('Body', function(line) {
    this.lines = line ? [line] : [];

}, {

    addLine: function(line) {
        this.lines.push(line);
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.lines, visitor, depth, fromTop);
    },

    toString: function() {
        return this.toLineBlock(1, this.lines);
    }

});

