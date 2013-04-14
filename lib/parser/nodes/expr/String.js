/*jshint evil: true */
var Node = require('../Node');

Node('String', function(value, raw) {

    if (raw) {
        value = value.substring(1, value.length - 1);
        this.value = value.replace(/\\`/g, '`');

    } else {
        this.value = eval(value); // shorthand for parsing escape sequences
    }

}, {

    isPrimitive: function() {
        // TODO not primitive in case where string interpolation is used!
        // always true for raw strings though
        return true;
    },

    getType: function() {
        return this.scope.resolveType('string');
    },

    toString: function() {
        return "'" + this.value.replace(/'/g, "\\'") + "'";
    }
});

