var Node = require('../Node');

Node('Float', function(value) {
    this.value = +value;

}, {

    isPrimitive: function() {
        return true;
    },

    getType: function() {
        return this.scope.resolveType('float');
    },

    toString: function() {
        return '' + this.value;
    }

});

