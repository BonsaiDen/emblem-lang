var Node = require('../Node');

Node('Identifier', function(name) {
    this.name = name;

}, {

    getType: function() {
        return this.scope.resolveName(this.toString()).type;
    },

    toString: function() {
        return this.scope.mapName(this.name);
    }
});

