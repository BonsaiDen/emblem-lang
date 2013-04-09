var Node = require('../Node');

Node('Cast', function(type, expression) {
    this.type = type;
    this.expression = expression;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.expression.visit(visitor, this, depth + 1, fromTop);
    },

    getType: function() {
        // TODO convert TypeNode into String
        //var et = this.expression.getType().isCastable();
    },

    toString: function() {
        var et = this.expression.getType();
        return et.getCastTemplate(et)(this.expression);
    }

});


