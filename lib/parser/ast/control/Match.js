var Node = require('../Node');

Node.Block('Match', function(expr, cases) {
    this.expr = expr;
    this.cases = cases || [];

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.expr.visit(visitor, this, depth + 1, fromTop);
        this.each(this.cases, function(elif) {
            elif.visit(visitor, this, depth + 1, fromTop);
        });
    },

    init: function() {
        return true;
    },

    toString: function() {
        return this.toWrapped(0, this.toLineBlock(1, this.cases), 'switch (' + this.expr + ') {', '}');
    }

});

