var Node = require('../Node');

Node('Ternary', function(condition, consequent, alternate) {

    this.condition = condition;
    this.consequent = consequent;
    this.alternate = alternate;

    this.lType = null;
    this.rType = null;

}, {

    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.condition.visit(visitor, this, depth + 1, fromTop);
        this.consequent.visit(visitor, this, depth + 1, fromTop);
        this.alternate.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        // TODO check primitive
        // condition must be boolean!
    },

    toString: function() {

    }

});

