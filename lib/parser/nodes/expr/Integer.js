var Node = require('../Node');

Node('Integer', function(value) {
    this.value = +value;

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
        return this.scope.resolveType('int');
    },

    toString: function() {
        return '' + this.value;
    }

});

