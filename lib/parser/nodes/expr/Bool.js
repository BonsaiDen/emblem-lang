var Node = require('../Node');

Node('Bool', function(value) {
    this.value = value === 'true';

}, {

    init: function() {
        this.setPrimitive(true);
        return this.setType(this.scope.resolveType('bool'));
    },

    toString: function() {
        return this.value ? 'true' : 'false';
    }

});

