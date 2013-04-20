var Node = require('../Node');

Node('Identifier', function(name) {
    this.name = name;

}, {

    init: function() {
        return true; // TODO check type here
    },

    getType: function() {
        return this.scope.resolveName(this.toString(true)).type;
    },

    toString: function(raw) {
        return raw ? this.name : this.scope.mapName(this.name);
    }

});

