var Node = require('../Node');

Node('MapItem', function(key, value) {
    this.key = key;
    this.value = value;

}, {

    // Custom -----------------------------------------------------------------
    isPrimitive: function() {
        return this.value.isPrimitive();
    },


    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.key.visit(visitor, this, depth + 1, fromTop);
        this.value.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        return true;
    },

    getType: function() {
        return this.scope.resolveTypeName('map', [
            this.key.getType(),
            this.value.getType()
        ]);
    },

    toString: function() {
        return this.key + ': ' + this.value;
    }

});

