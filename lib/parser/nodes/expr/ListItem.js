var Node = require('../Node');

Node('ListItem', function(value) {
    this.value = value;

}, {

    // Custom -----------------------------------------------------------------
    isPrimitive: function() {
        return this.value.isPrimitive();
    },


    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.value.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        return true;
    },

    getType: function() {
        return this.scope.resolveTypeName('list', [
            this.value.getType()
        ]);
    },

    toString: function() {
        return '' + this.value;
    }

});

