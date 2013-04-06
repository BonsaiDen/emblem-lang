var Node = require('../Node');

Node('Scope', function(body) {
    // TODO where to handle scope? Here, or in body?
    this.body = body;

}, {

    block: true,

    visit: function(visitor, parentNode, depth, fromTop) {
        this.body.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        // TODO howto handle newlines?
        return '' + this.body + '';
    }

});


