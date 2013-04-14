var Node = require('../Node');

Node('MapItem', function(key, value) {
    this.key = key;
    this.value = value;

}, {

    isPrimitive: function() {
        return this.value.isPrimitive();
    },

    getType: function() {
        return this.scope.resolveTypeName('map', [
            this.key.getType(),
            this.value.getType()
        ]);
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.key.visit(visitor, this, depth + 1, fromTop);
        this.value.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        return this.key + ': ' + this.value;
    }

});

