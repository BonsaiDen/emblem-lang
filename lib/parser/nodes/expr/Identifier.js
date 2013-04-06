var Node = require('../Node');

Node('Identifier', function(name) {
    this.name = name;

}, {
    toString: function() {
        // TODO re-name things like reserved words and hasOwnProperty here
        return '' + this.name;
    }
});

