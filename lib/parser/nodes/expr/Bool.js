var Node = require('../Node');

Node('Bool', function(value) {
    this.value = value === true;

}, {

    init: function() {
        this.type = this.scope.resolveType('bool');
    },

    toString: function() {
        return this.value ? 'true' : 'false';
    }

});

