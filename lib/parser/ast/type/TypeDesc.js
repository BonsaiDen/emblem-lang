var Node = require('../Node');

Node('TypeDesc', function(type) {
    this.type = type;

}, {

    visit: function(visitor, parentNode, depth, fromTop) {
        this.type.visit(visitor, this, depth + 1, fromTop);
    },

    init: function() {
        return this.setType(this.type.getType());
    }

});

