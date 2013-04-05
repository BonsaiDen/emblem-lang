var Node = require('../Node');

Node('This', function() {}, {
    toString: function() {
        return 'this';
    }
});

