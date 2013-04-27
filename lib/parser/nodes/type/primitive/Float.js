var Node = require('../../Node');

Node('Float', function(value) {
    this.value = +value;

}, {

    init: function() {
        this.setPrimitive(true);
        return this.setType(this.scope.resolveType('float'));
    },

    toString: function() {
        return '' + this.value;
    }

});

