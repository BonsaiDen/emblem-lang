var Node = require('../Node');

Node('Identifier', function(name) {
    this.name = name;

}, {

    getType: function() {
        return this.scope.resolveName(this.toString()).type;
    },

    toString: function() {
        // TODO re-name things like reserved words (return etc) and hasOwnProperty here
        return '' + this.name;
    }
});

