var Node = require('../../Node');

Node('String', function(value) {
    this.value = value;
    this.string = null;

}, {

    init: function() {
        // TODO not primitive in case where string interpolation is used!
        // always true for raw strings though
        this.setPrimitive(true);
        this.setType(this.scope.resolveType('string'));
        this.string = "'" + this.value.replace(/'/g, "\\'") + "'";
        return true; // Validate interpolation and move it from the constructor to this function
    },

    toString: function() {
        return this.string;
    }

});

