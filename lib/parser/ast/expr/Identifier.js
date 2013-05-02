var Node = require('../Node');

Node('Identifier', function(name) {
    this.name = name;

    this.type = null;

}, {

    init: function() {
        return true;
    },

    getType: function() {

        // Must be done this way since there are "passive" identifiers
        // in numerous places e.g. User Types, import module paths
        if (this.type === null) {
            this.type = this.scope.resolveName(this.toString(true)).type;
        }

        return this.type;

    },

    toString: function(raw) {
        return raw ? this.name : this.scope.mapName(this.name);
    }

});

