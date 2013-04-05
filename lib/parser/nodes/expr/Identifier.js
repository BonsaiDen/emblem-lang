var Node = require('../Node');

Node('Identifier', function(name) {
    this.name = name;

}, {
    toString: function() {
        return '' + this.name;
    }
});

