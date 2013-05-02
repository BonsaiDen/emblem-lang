var Node = require('../Node');

Node.Statement('Line', function(expression, statement) {
    this.expression = expression;
    this.statement = statement;

}, {

    // Custom -----------------------------------------------------------------
    isEmpty: function() {
        return this.expression === null && this.statement === null;
    },

    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        (this.statement ? this.statement : this.expression).visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        return true;
    },

    toString: function() {
        return this.statement ? '' + this.statement : this.expression + ';';
    }

});

