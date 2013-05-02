var Node = require('../Node');

Node('Cast', function(type, expression) {
    this.type = type;
    this.expression = expression;

    this.eType = null;
    this.cType = null;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.type.visit(visitor, this, depth + 1, fromTop);
        this.expression.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {

        this.setPrimitive(this.expression.isPrimitive());
        this.eType = this.expression.getType();
        this.cType = this.type.getType();

        return this.setType(this.eType.getCastType(this.cType));

    },

    toString: function() {
        return this.eType.getCastTemplate(this.cType)(this.expression);
    }

});

