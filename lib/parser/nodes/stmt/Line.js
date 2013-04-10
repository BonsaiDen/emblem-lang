var Node = require('../Node');

Node.Statement('Line', function(expression, statement) {
    this.statement = statement;
    this.expression = expression;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        (this.statement ? this.statement : this.expression).visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        return this.statement ? '' + this.statement : this.expression + ';';
    }

});

