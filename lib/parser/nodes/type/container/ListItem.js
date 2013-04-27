var Node = require('../../Node');

Node('ListItem', function(value) {
    this.value = value;

}, {

    // Node -------------------------------------------------------------------
    visit: function(visitor, parentNode, depth, fromTop) {
        this.value.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        this.setPrimitive(this.value.isPrimitive());
        return this.setType(this.scope.resolveTypeName('list', [
            this.value.getType()
        ]));
    },

    toString: function() {
        return '' + this.value;
    }

});

