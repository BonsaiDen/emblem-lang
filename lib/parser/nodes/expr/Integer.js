var Node = require('../Node');

Node('Integer', function(value) {
    this.value = +value;

}, {

    init: function() {
        this.setPrimitive(true);
        return this.setType(this.scope.resolveType('int'));
    },

    toString: function() {
        return this.value.toString(10);
    }

});

