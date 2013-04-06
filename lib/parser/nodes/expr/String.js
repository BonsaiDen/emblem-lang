/*jshint evil: true */
var Node = require('../Node');

Node('String', function(value) {
    this.value = eval(value);

}, {

    getType: function() {
        return this.scope.resolveType('string');
    },

    toString: function() {
        return "'" + this.value.replace(/'/g, "\\'") + "'";
    }
});

