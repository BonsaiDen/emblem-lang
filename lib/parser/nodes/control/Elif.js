var Node = require('../Node');

Node.Block('Elif', function(expr, body) {
    this.expr = expr;
    this.body = body;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.expr.visit(visitor, this, depth + 1, fromTop);
        this.body.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {

        var bool = this.scope.resolveType('bool');
        if (this.expr.getType() !== bool) {
            throw new TypeError('expression of elif statment must be boolean');

        } else {
            return true;
        }

    },

    toString: function() {
        return this.toWrapped(0, this.body, ' else if (' + this.expr + ') {', '}');
    }

});

