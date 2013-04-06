var Node = require('../Node');

Node('Assign', function(target, expr, operator) {
    this.target = target;
    this.expression = expr;
    this.op = operator ? operator : '=';

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.target.visit(visitor, this, depth + 1, fromTop);
        this.expression.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        if (this.op === '=') {
            return this.target + ' = ' + this.expression;

        } else {
            return this.target + ' ' + this.op + '= ' + this.expression;
        }
    }

});

