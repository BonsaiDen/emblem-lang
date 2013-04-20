var Node = require('../Node');

Node('TypeDesc', function(type, modifier) {

    this.type = type;
    this.modifier = modifier || [];

    this.constant = false;

}, {

    // Custom -----------------------------------------------------------------
    isConstant: function() {
        return this.constant;
    },


    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.type.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        this.constant = this.modifier.indexOf('const') !== -1;
        return this.setType(this.type.getType());
    }

});

