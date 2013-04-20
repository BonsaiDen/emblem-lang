var Node = require('../Node');

Node('TypeDesc', function(type, modifier) {

    modifier = modifier || [];

    this.type = type;
    this.modifier = {
        constant: modifier.indexOf('const') !== -1
    };

}, {

    // Custom -----------------------------------------------------------------
    isConstant: function() {
        return this.modifier.constant;
    },


    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.type.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        return true; // TODO return the type?
    },

    getType: function() {
        return this.type.getType();
    }

});

