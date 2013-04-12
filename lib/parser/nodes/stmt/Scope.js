var Node = require('../Node');

Node.Block('Scope', function(body) {
    this.body = body;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.body.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        return this.toWrapped(0, this.body, '{', '}');
    }

});


