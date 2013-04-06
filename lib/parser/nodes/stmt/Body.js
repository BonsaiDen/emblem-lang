var Node = require('../Node');

Node('Body', function(line) {
    // TODO patch on scope?
    this.lines = line ? [line] : [];

}, {

    addLine: function(line) {
        this.lines.push(line);
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.visitChildren(this.lines, visitor, depth, fromTop);
    },

    toString: function(indent) {
        // TODO include block depth later on which should handle indentation
        // TODO build indentation depth into tree along side blocks?
        return this.lines.join('\n');
    }

});

