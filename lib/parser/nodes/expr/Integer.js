var Node = require('../Node');

Node('Integer', function(value) {
    this.value = +value;

}, {

    isPrimitive: function() {
        return true;
    },

    getType: function() {
        return this.scope.resolveType('int');
    },

    toString: function() {
        return '' + this.value;
    }

});

