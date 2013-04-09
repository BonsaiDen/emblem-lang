var Node = require('../Node');

Node('TypeDesc', function(type, modifier) {

    modifier = modifier || [];

    this.type = type;
    this.modifier = {
        constant: modifier.indexOf('const') !== -1
    };

}, {

    isConstant: function() {
        return this.modifier.constant;
    },

    visit: function(visitor, parentNode, depth, fromTop) {
        this.type.visit(visitor, this, depth + 1, fromTop);
    },

    getType: function() {
        return this.scope.resolveType(this.type.toString());
    }

});

