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

        // TODO include block depth later on which should handle indentation
        // TODO build indentation depth into tree along side blocks?
        var indent = new Array((this.scope.depth + 1) * 4 + 1).join(' ');
        return '\n' + indent + this.lines.join('\n' + indent) + '\n';
    }

});

