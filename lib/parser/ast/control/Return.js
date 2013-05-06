var Node = require('../Node');

Node('Return', function(expr) {
    this.expr = expr || null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.expr && this.expr.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        // TODO return type MUST match return type of outer function
        return true;
    },

    toString: function() {
        return 'return ' + (this.expr ? this.expr : '') + ';';
    }

});

