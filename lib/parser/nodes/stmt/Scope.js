var Node = require('../Node');

Node.Block('Scope', function(body) {
    this.body = body;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.body.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        // TODO howto handle newlines?
        // TODO helper for indentation is needed!
        var indent = new Array((this.scope.depth) * 4 + 1).join(' ');
        return '{' + this.body + indent + '}';
    }

});


