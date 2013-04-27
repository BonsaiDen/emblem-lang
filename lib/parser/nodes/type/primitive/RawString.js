var Node = require('../../Node');

Node('RawString', function(value) {
    this.value = value;
    this.string = null;

}, {

    init: function() {
        this.value = this.value.replace(/\\`/g, '`');
        this.string = "'" + this.value.replace(/'/g, "\\'") + "'";
        this.setPrimitive(true);
        return this.setType(this.scope.resolveType('string'));
    },

    toString: function() {
        return this.string;
    }

});

