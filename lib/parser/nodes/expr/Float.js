var Node = require('../Node');

Node('Float', function(value) {
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
        return this.scope.resolveType('float');
    },

    toString: function() {
        return '' + this.value;
    }

});

