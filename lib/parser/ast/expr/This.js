var Node = require('../Node');

Node('This', function() {}, {

    getType: function() {
        return null; // Figure out the class in init()!
    },

    init: function() {
        return true;
    },

    toString: function() {
        return 'this';
    }

});

