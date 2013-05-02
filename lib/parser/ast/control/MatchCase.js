var Node = require('../Node');

Node.Block('MatchCase', function(expr, body) {
    this.expr = expr;
    this.body = body;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.expr.visit(visitor, this, depth + 1, fromTop);
        this.body.visit(visitor, this, depth + 1, fromTop);
    }

    // TODO expression must match type of parent match expr

});

