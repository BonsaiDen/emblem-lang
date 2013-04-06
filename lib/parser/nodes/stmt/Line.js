var Node = require('../Node');

Node('Line', function(expression, statment) {
    this.statment = statment;
    this.expression = expression;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        (this.statment || this.expression).visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        return this.statment ? '' + this.statment : this.expression + ';';
    }

});

