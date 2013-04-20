var Node = require('../Node');

Node('Identifier', function(name) {
    this.name = name;

}, {

    init: function() {
        return this.setType(this.scope.resolveName(this.toString(true)).type);
    },

    toString: function(raw) {
        return raw ? this.name : this.scope.mapName(this.name);
    }

});

