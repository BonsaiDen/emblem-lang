var Node = require('../Node');

Node('Index', function(key) {
    this.key = key;

}, {
    toString: function() {
        return '[' + this.key + ']';
    }
});

