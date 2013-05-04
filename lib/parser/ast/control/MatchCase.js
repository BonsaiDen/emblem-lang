var Node = require('../Node');

Node.Block('MatchCase', function(expr, body) {
    this.expr = expr;
    this.body = body;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.expr.visit(visitor, this, depth + 1, fromTop);
        this.body.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        // TODO expression must match type of outer match statement
        return true;
    },

    toString: function() {
        return this.toWrapped(0, this.body, 'case (' + this.expr + '): {', 'break;}');
    }

});

