var Node = require('../Node');

Node('Bool', function(value) {
    this.value = value === 'true';

}, {

    // Custom -----------------------------------------------------------------
    isPrimitive: function() {
        return true;
    },


    // Node -------------------------------------------------------------------
    init: function() {
        return true;
    },

    getType: function() {
        return this.scope.resolveType('bool');
    },

    toString: function() {
        return this.value ? 'true' : 'false';
    }

});

