var Node = require('../Node');

Node('ListItem', function(value) {
    this.value = value;

}, {

    getType: function() {
        return this.scope.resolveTypeName('list', [
            this.value.getType()
        ]);
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.value.visit(visitor, this, depth + 1, fromTop);
    },

    toString: function() {
        return '' + this.value;
    }

});


