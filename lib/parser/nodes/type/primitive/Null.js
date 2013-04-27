var Node = require('../../Node');

Node('Null', function() {}, {

    init: function() {
        this.setPrimitive(true);
        return this.setType(this.scope.resolveType('null'));
    },

    toString: function() {
        return 'null';
    }

});

