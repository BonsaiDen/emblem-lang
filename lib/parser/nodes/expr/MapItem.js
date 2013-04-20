var Node = require('../Node');

Node('MapItem', function(key, value) {
    this.key = key;
    this.value = value;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.key.visit(visitor, this, depth + 1, fromTop);
        this.value.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        this.setPrimitive(this.value.isPrimitive());
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

