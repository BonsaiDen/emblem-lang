var Node = require('../../Node');

Node('Function', function() {

}, {

    init: function() {
        this.setPrimitive(false);
        return true;
    },

    toString: function() {
        return '<function>';
    }

});

