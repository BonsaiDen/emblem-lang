var Node = require('../Node');

Node('Cast', function(type, expression) {
    this.type = type;
    this.expression = expression;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.type.visit(visitor, this, depth + 1, fromTop);
        this.expression.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        return true;
    },

    getType: function() {
        return this.expression.getType().getCastType(this.type.getType());
    },

    toString: function() {
        var exprType = this.expression.getType();
        return exprType.getCastTemplate(this.type.getType())(this.expression);
    }

});


