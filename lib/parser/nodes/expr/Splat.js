var Node = require('../Node');

Node('Splat', function(expr) {
    // TODO how to stringify this? Needs to be joined with ',' and implanted into arguments list
    this.expression = expr;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.expression.visit(visitor, this, depth + 1, fromTop);
    }

});

