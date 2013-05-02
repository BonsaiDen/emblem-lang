var Node = require('../Node');

Node.Block('Scope', function(body) {
    this.body = body;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.body.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        return true;
    },

    toString: function() {
        return this.toWrapped(0, this.body, '{', '}');
    }

});

