var Node = require('../Node');

Node('Bool', function(value) {
    this.value = value === 'true';

}, {

    getType: function() {
        return this.scope.resolveType('bool');
    },

    toString: function() {
        return this.value ? 'true' : 'false';
    }

});

